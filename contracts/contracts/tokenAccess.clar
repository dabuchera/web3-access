
;;
;; tokenAccess.clar
;;
;; A token-based access contract to a material passport stored on Gaia.
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
(define-constant err-unauthorised (err u1000))
(define-constant err-already-added (err u1001))
(define-constant err-no-admin (err u1002))

;; ------------------------------
;; data maps and vars
;; ------------------------------

;; TODO: A counter for the number of accesses

;; A map that creates a principal => bool relation to store admin roles.
(define-map admins principal bool)

;; ------------------------------
;; private functions
;; ------------------------------

;; A function checking whether the caller is an admin or the owner
(define-private (check-owner-admin)
    (ok (asserts! (or (is-eq contract-owner contract-caller) (is-admin contract-caller)) err-unauthorised))
)

;; TODO: A function checking whether the caller ownes an NFT?

;; ------------------------------
;; public functions
;; ------------------------------

;; A function that can add a new admin
(define-public (add-admin (admin principal))
    (begin
        (try! (check-owner-admin))
        (asserts! (map-insert admins admin true) err-already-added)
        (ok (print {event: "add-admin", admin: admin}))
    )
)

;; A function that can remove an admin
(define-public (remove-admin (admin principal))
    (begin
        (try! (check-owner-admin)) 
        (asserts! (default-to false (map-get? admins admin)) err-no-admin)
        (map-set admins admin false)
        (ok (print {event: "remove-admin", admin: admin}))
    )
)

;; TODO: A function to mint an access NFT


;; TODO: A function to store the material passport files to Gaia


;; TODO: A function to access the material passport file from Gaia


;; ------------------------------
;; call functions
;; ------------------------------

;; A function to retrieve the contract owner
(define-read-only (whoIsOwner)
	(print contract-owner)
)

;; A function to retrieve whether an address is an admin
(define-read-only (is-admin (admin principal))
	(default-to false (map-get? admins admin))
)

;; TODO: A function to retrieve wether an address owns an access NFT


;; TODO: A function to retrieve the number of accesses to the file