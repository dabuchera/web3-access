;;
;; rolesAccess.clar
;;
;; A role-based access contract for data stored with Gaia.
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
(define-constant err-already-ten-entries (err u1004))
(define-constant err-empty-map (err u1005))

;; ------------------------------
;; data maps and vars
;; ------------------------------

;; A variable that can be set by the contract owner to disable all smart contract functions.
;; 1 is operable, 0 is not operable
(define-data-var contract-operable uint u1)

;; A map that creates a dataURL => data-owner relation to verify who can add new data-accessors
(define-map data-owners (string-ascii 100) principal)

;; A map that creates a dataURL => data-accessor relation to specify who can access the shared file.
;; The URL can be maximum 100 units long
;; The mapping can store maximum 10 addresses per URL
(define-map data-accessors (string-ascii 100) (list 10 principal))

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

;; A function checking whether the caller is a data-owner
(define-private (check-data-owner (url (string-ascii 100)))
    (ok (asserts! (is-eq (unwrap! (get-data-owner url) err-empty-map) contract-caller) err-unauthorised))
)

;; A function checking whether the caller is a data-accessor
(define-private (check-data-accessor (url (string-ascii 100)))
    (ok (asserts! (is-data-accessor url contract-caller) err-unauthorised))
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

;; A function to register a new data-owner for a dataURL
(define-public (add-data-owner (url (string-ascii 100)))
    (begin
        (try! (check-contract-operable))
        ;; Check that the caller is not an intermediate contract
        (asserts! (is-eq tx-sender contract-caller) err-unauthorised)
        ;; Add new entry only if the url is unused
        (asserts! (map-insert data-owners url contract-caller) err-already-added)
        (ok (print {event: "owner added for URL", data-owner: contract-caller, url: url}))
    )
)

;; A function to remove a data-owner for a dataURL
(define-public (remove-data-owner (url (string-ascii 100)))
    (begin
        (try! (check-contract-operable))
        ;; Check that it is the current data-owner calling this function
        (try! (check-data-owner url))
        ;; Remove entry only if the url is unused
        (asserts! (map-delete data-owners url) err-already-removed)
        (ok (print {event: "owner removed for URL", data-owner: contract-caller, url: url}))
    )
)

;; A function that can add a new data-accessor for a given URL
(define-public (add-data-accessor (url (string-ascii 100)) (address principal))
    (begin
        (try! (check-contract-operable))
        ;; Check that the caller has the right to add this role for this URL.
        (try! (check-data-owner url))
        ;; Check that the address was not already added
        (asserts! (not (is-data-accessor url address)) err-already-added)
        ;; Check that there is not already 10 data accessors for this URL
        (asserts! (< (length-list-of-data-accessors url) u10) err-already-ten-entries)
        ;; Update the mapping with the appended list
        (map-set data-accessors url (unwrap-panic (as-max-len? (append (list-of-data-accessors url) address) u10)))
        (ok (print {event: "new address added as accessor", url: url, data-accessor: address}))
    )
)

;; A function to delete all data-accessor for a given URL
;; TODO: How to delete only one data-accessor for a given URL?
(define-public (remove-data-accessors (url (string-ascii 100)))
    (begin
        (try! (check-contract-operable))
        ;; Check that the caller has the right to add this role for this URL.
        (try! (check-data-owner url))
        ;; Remove entry only if the url is unused
        (asserts! (map-delete data-accessors url) err-already-removed)
        (ok (print {event: "all accessors deleted", url: url}))
    )
)

;; ------------------------------
;; call functions
;; ------------------------------

;; A function to retrieve the contract owner
(define-read-only (who-is-contract-owner)
	(print contract-owner)
)

;; A function to retrieve the data-owner for a given URL
(define-read-only (get-data-owner (url (string-ascii 100)))
	;;(unwrap-panic (map-get? data-owners url))
    (ok (unwrap! (map-get? data-owners url) err-empty-map))
)

;; A function to retrieve the list of data-accessors for a given URL
(define-read-only (list-of-data-accessors (url (string-ascii 100)))
	(default-to (list) (map-get? data-accessors url))
)

;; A function to retrieve the list-length of data-accessors for a given URL
(define-read-only (length-list-of-data-accessors (url (string-ascii 100)))
    (len (list-of-data-accessors url))
)

;; A function to retrieve the index of an address in a list of data-accessors for a given URL
(define-read-only (index-of-data-accessor (url (string-ascii 100)) (address principal))
    ;; u99 means there is no list entry for this address (none)
    (default-to u99 (index-of (list-of-data-accessors url) address))
)

;; A function to retrieve wether an address has access for a given URL
(define-read-only (is-data-accessor (url (string-ascii 100)) (address principal))
    ;; checks whether the returned value is u99, which means it should return false --> inverse of returned bool
    (not (is-eq (index-of-data-accessor url address) u99))
)
