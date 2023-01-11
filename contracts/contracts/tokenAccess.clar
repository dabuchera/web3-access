
;;
;; tokenAccess.clar
;;
;; A token-based access contract for data stored with Gaia.
;;
;; This contract is developed for the EC3 2023 conference paper on Web3
;; access control in the built environment.
;;

;; ------------------------------
;; constants
;; ------------------------------

;; The primitive deploying the contract becomes the contract-owner
(define-constant contract-owner tx-sender)

;; Define error handling variables
(define-constant err-not-operable (err u1000))
(define-constant err-unauthorised (err u1001))
(define-constant err-already-added (err u1002))
(define-constant err-no-owner-yet (err u1003))
(define-constant err-already-ten-entries (err u1004))
(define-constant err-empty-map (err u1005))

;; ------------------------------
;; data maps and vars
;; ------------------------------

;; A variable that can be set by the contract owner to disable all smart contract functions.
;; 1 is operable, 0 is not operable
(define-data-var contract-operable uint u1)

;; A map that creates a dataURL => nft-uri relation to verify which ownershipNFT can mint access tokens for a given URL
(define-map data-ownership-nfts (string-ascii 100) uint)

;; A map that creates a dataURL => {token uri list / bool} relation to specify which access-token uri's have access
;; and whether token access is enabled. There can be maximum 10 access NFTs per data-url.
(define-map data-access-nfts (string-ascii 100) {token-uri: (list 10 uint), access-enabled: bool})

;; ------------------------------
;; private functions
;; ------------------------------

;; A function checking wether the caller is the contract owner
(define-private (check-contract-owner)
    (ok (asserts! (is-eq contract-owner contract-caller) err-unauthorised))
)

;; A function checking wether the contract is operable
(define-private (check-contract-operable)
	(ok (asserts! (is-eq (var-get contract-operable) u1) err-not-operable))
)

;; A function comparing the ownershipNFT owner with the caller
(define-private (check-nft-owner (url (string-ascii 100)))
	(ok (asserts! (is-eq (unwrap-panic (get-ownership-nft-owner url)) contract-caller) err-unauthorised))
)

;; ------------------------------
;; public functions
;; ------------------------------

;; A function to change the contract-operable variable
(define-private (change-contract-operable)
    (begin
        (try! (check-contract-owner))
        (if (is-eq (var-get contract-operable) u1)
            (var-set contract-operable u0)
            (var-set contract-operable u1) ;;else
        )
    (ok (print {event: "state changed", contract-operable: (var-get contract-operable)}))
    )
)

;; A function to mint an NFT for a dataURL and store uri in the data-ownership-nfts mapping
(define-public (mint-ownership-nft (url (string-ascii 100)))
    (begin
        (try! (check-contract-operable))
        ;; Check that the caller is not an intermediate contract
        (asserts! (is-eq tx-sender contract-caller) err-unauthorised)
        ;; Check that the url does not already have an NFT associated with it
        (asserts! (is-none (map-get? data-ownership-nfts url)) err-already-added)
        ;; Mint ownershipNFT and add new entry (mint returns the minted token URI)
        (map-set data-ownership-nfts url (try! (contract-call? .ownershipNFT mint tx-sender)))
        (ok (print {event: "new ownership-nft minted", owner: tx-sender, uri: (map-get? data-ownership-nfts url), url: url}))
    )
)

;; A function to mint a data access NFT for a dataURL and store the info in the data-access-nfts mapping
(define-public (mint-data-access-nft (url (string-ascii 100)))
    (begin
        (try! (check-contract-operable))
        ;; Check that the caller is the owner of the correct ownershipNFT
        (try! (check-nft-owner url))
        ;; Check that the url does not already have 10 NFTs associated with it
        (asserts! (< (length-list-of-access-nft url) u10) err-already-ten-entries)
        ;; Mint ownershipNFT and add new entry (mint returns the minted token URI). Access default is true.
        (map-set data-access-nfts url {token-uri: (unwrap-panic (as-max-len? (append (list-of-access-nft url) (try! (contract-call? .accessNFT mint contract-caller))) u10)), access-enabled: true})
        (ok (print {event: "new access-nft minted", owner: tx-sender, uri: (map-get? data-access-nfts url), url: url}))
    )
)

;; A function to disable/enable token access for a given URL
(define-public (change-access-nft-activation (url (string-ascii 100)))
    (begin
        (try! (check-contract-operable))
        ;; Check that the caller is the owner of the correct ownershipNFT
        (try! (check-nft-owner url))
        ;; Check wether access is enabled or disabled and change the state
        (if (is-eq (access-nft-enabled url) true)
            (map-set data-access-nfts url {token-uri: (list-of-access-nft url), access-enabled: false})
            (map-set data-access-nfts url {token-uri: (list-of-access-nft url), access-enabled: true}) ;;else
        )
        (ok (print {event: "access-enabled changed", access-enabled: (access-nft-enabled url), url: url}))
    )
)

;; ------------------------------
;; call functions
;; ------------------------------

;; A function to retrieve the contract owner
(define-read-only (who-is-contract-owner)
	(print contract-owner)
)

;; A function to retrieve the ownership-nft uri for a given URL
(define-read-only (which-ownership-nft (url (string-ascii 100)))
	(ok (unwrap! (map-get? data-ownership-nfts url) err-empty-map))
)

;; A function to retrieve the owner of a ownership-nft url, if none it returns an error
(define-read-only (get-ownership-nft-owner (url (string-ascii 100)))
    (let ((owner (unwrap-panic (contract-call? .ownershipNFT get-owner (unwrap! (which-ownership-nft url) err-empty-map)))))
        (ok (unwrap! owner err-no-owner-yet))
    )
)

;; A function to retrieve the list of access-nfts for a given URL
(define-read-only (list-of-access-nft (url (string-ascii 100)))
	(get token-uri (default-to {token-uri: (list), access-enabled: false} (map-get? data-access-nfts url)))
)

;; A function to retrieve the list-length of access-nfts for a given URL
(define-read-only (length-list-of-access-nft (url (string-ascii 100)))
    (len (list-of-access-nft url))
)

;; A function to retrieve whether access is enabled for a given URL
(define-read-only (access-nft-enabled (url (string-ascii 100)))
	(get access-enabled (default-to {token-uri: (list), access-enabled: false} (map-get? data-access-nfts url)))
)

;; A function to retrieve the owner of a access-nft uri, if none it returns an error
;; The uri has to be retrieved from the list of uri for a given url, calling the "list-of-access-nft" function
(define-read-only (get-access-nft-owner (uri uint))
    (let ((owner (unwrap-panic (contract-call? .accessNFT get-owner uri))))
        (ok (unwrap! owner err-no-owner-yet))
    )
)