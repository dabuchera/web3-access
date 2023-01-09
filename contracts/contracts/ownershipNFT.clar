;;
;; ownershipNFT.clar
;; ownershipNFT: A SIP009-compliant NFT with a mint function.
;;

(impl-trait 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait.nft-trait)

(define-constant contract-owner tx-sender)

(define-constant err-token-id-failure (err u100))
(define-constant err-not-token-owner (err u101))

(define-non-fungible-token ownershipNFT uint)
(define-data-var token-id-nonce uint u0)

(define-read-only (get-last-token-id)
	(ok (var-get token-id-nonce))
)

(define-read-only (get-token-uri (token-id uint))
	(ok none)
)

(define-read-only (get-owner (token-id uint))
	(ok (nft-get-owner? ownershipNFT token-id))
)

(define-public (transfer (token-id uint) (sender principal) (recipient principal))
	(begin
		(asserts! (is-eq tx-sender sender) err-not-token-owner)
		(nft-transfer? ownershipNFT token-id sender recipient)
	)
)

(define-public (mint (recipient principal))
	(let ((token-id (+ (var-get token-id-nonce) u1)))
		(try! (nft-mint? ownershipNFT token-id recipient))
		(asserts! (var-set token-id-nonce token-id) err-token-id-failure)
		(ok token-id)
	)
)
