
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
(define-constant err-already-removed (err u1003))

;; ------------------------------
;; data maps and vars
;; ------------------------------

;; A variable that can be set by the contract owner to disable all smart contract functions.
;; 1 is operable, 0 is not operable
(define-data-var contract-operable uint u1)

;; A map that creates a dataURL => nft-address relation to verify who can mint access tokens for a given URL
(define-map data-nft (string-ascii 100) principal)

;; A map that creates a dataURL => {token address / token number / bool} relation to specify which token has access,
;; the number of tokens created, and whether token access is enabled
(define-map token-data-access (string-ascii 100) {token-address: principal, token-number: uint, access-enabled: bool})

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

;; TODO: A function checking whether the caller is the NFT owner

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

;; TODO: A function to mint an NFT for a dataURL
;; Is there a way to proof ownership of a dataURL?
;; Mint NFT and store address in the data-nft mapping

;; TODO: A function to mint data access tokens
;; Check whether the caller is the NFT owner
;; Mint token and store details in token-data-access mapping
;; Access is default true
;; Can function overwrite existing entry?

;; TODO: A function to disable/enable token access for a dataURL
;; Check wether caller is the NFT owner

;; ------------------------------
;; call functions
;; ------------------------------

;; A function to retrieve the contract owner
(define-read-only (whoIsOwner)
	(print contract-owner)
)

;; TODO: a function to retrieve the needed NFT address for a given URL

;; TODO: a function to retrieve the access token details for a given URL

;; TODO: a function to retrieve whether access is enabled for a given URL
