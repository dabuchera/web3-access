import { Clarinet, Tx, Chain, Account, types } from "https://deno.land/x/clarinet@v1.4.2/index.ts";
import { assertEquals } from "https://deno.land/std@0.178.0/testing/asserts.ts";

let testURL = "https://gaia.blockstack.org/hub/1NkTNTS6VhP2VEVyU84w3spmYgk2bi8tRp/test.txt";

Clarinet.test({
    name: "Can mint an ownerhsipNFT for a URL and retrieve its owner.",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let address1 = accounts.get("deployer")!.address;

        /* Mint new ownershipNFT */
        let block = chain.mineBlock([
            Tx.contractCall("tokenAccess", "mint-ownership-nft", [types.ascii(testURL)], address1)
        ]);
        let inner = block.receipts[0].result.expectOk();
        let tuple: any = inner.expectTuple();
        tuple["owner"].expectPrincipal(address1);
        assertEquals(tuple["owner"], address1); /* Can also check the same with assertEquals. What is better?*/
        tuple["uri"].expectSome().expectUint(1);
        tuple["url"].expectAscii(testURL);

        /* Retrieve owner of ownershipNFT */
        block = chain.mineBlock([
            Tx.contractCall("tokenAccess", "get-ownership-nft-owner", [types.ascii(testURL)], address1)
        ]);
        block.receipts[0].result.expectOk().expectPrincipal(address1)

    },
});

Clarinet.test({
    name: "Cannot mint ownershipNFT for an URL twice.",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let address1 = accounts.get("deployer")!.address;
        let address2 = accounts.get("wallet_1")!.address;

        /* Mint ownershipNFT */
        let block = chain.mineBlock([
            Tx.contractCall("tokenAccess", "mint-ownership-nft", [types.ascii(testURL)], address1)
        ]);
        
        /* Try to mint ownershipNFT again */
        block = chain.mineBlock([
            Tx.contractCall("tokenAccess", "mint-ownership-nft", [types.ascii(testURL)], address2)
        ]);
        block.receipts[0].result.expectErr().expectUint(1002);
    },
});

Clarinet.test({
    name: "Can mint up to ten accessNFTs.",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let address1 = accounts.get("deployer")!.address;

        /* Mint ownershipNFT */
        let block = chain.mineBlock([
            Tx.contractCall("tokenAccess", "mint-ownership-nft", [types.ascii(testURL)], address1)
        ]);

        /* Mint accessNFT */
        block = chain.mineBlock([
            Tx.contractCall("tokenAccess", "mint-data-access-nft", [types.ascii(testURL)], address1)
        ]);
        let inner = block.receipts[0].result.expectOk();
        let tuple: any = inner.expectTuple();
        let innerTuple: any = tuple["uri"].expectSome().expectTuple();
        let innerTupleList: any = innerTuple["token-uri"].expectList();
        tuple["owner"].expectPrincipal(address1);
        assertEquals(innerTupleList, ["u1"]);
        innerTuple["access-enabled"].expectBool(true);
        tuple["url"].expectAscii(testURL);

        /* Retrieve accessNFT owner */
        block = chain.mineBlock([
            Tx.contractCall("tokenAccess", "get-access-nft-owner", [types.uint(1)], address1)
        ]);
        block.receipts[0].result.expectOk().expectPrincipal(address1);

        /* Mint nine more accessNFTs */
        block = chain.mineBlock([
            Tx.contractCall("tokenAccess", "mint-data-access-nft", [types.ascii(testURL)], address1)
        ]);
        block = chain.mineBlock([
            Tx.contractCall("tokenAccess", "mint-data-access-nft", [types.ascii(testURL)], address1)
        ]);
        block = chain.mineBlock([
            Tx.contractCall("tokenAccess", "mint-data-access-nft", [types.ascii(testURL)], address1)
        ]);
        block = chain.mineBlock([
            Tx.contractCall("tokenAccess", "mint-data-access-nft", [types.ascii(testURL)], address1)
        ]);
        block = chain.mineBlock([
            Tx.contractCall("tokenAccess", "mint-data-access-nft", [types.ascii(testURL)], address1)
        ]);
        block = chain.mineBlock([
            Tx.contractCall("tokenAccess", "mint-data-access-nft", [types.ascii(testURL)], address1)
        ]);
        block = chain.mineBlock([
            Tx.contractCall("tokenAccess", "mint-data-access-nft", [types.ascii(testURL)], address1)
        ]);
        block = chain.mineBlock([
            Tx.contractCall("tokenAccess", "mint-data-access-nft", [types.ascii(testURL)], address1)
        ]);
        block = chain.mineBlock([
            Tx.contractCall("tokenAccess", "mint-data-access-nft", [types.ascii(testURL)], address1)
        ]);
        inner = block.receipts[0].result.expectOk();
        tuple = inner.expectTuple();
        innerTuple = tuple["uri"].expectSome().expectTuple();
        innerTupleList = innerTuple["token-uri"].expectList();
        assertEquals(innerTupleList, [
            "u1",  "u2", "u3",
            "u4",  "u5", "u6",
            "u7",  "u8", "u9",
            "u10"
          ]);

        /* Try mint the 11th accessNFT */
        block = chain.mineBlock([
            Tx.contractCall("tokenAccess", "mint-data-access-nft", [types.ascii(testURL)], address1)
        ]);
        block.receipts[0].result.expectErr().expectUint(1004);  
    },
});

Clarinet.test({
    name: "Cannot mint an accessNFT when calling address is not the owner of the ownershipNFT.",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let address1 = accounts.get("deployer")!.address;
        let address2 = accounts.get("wallet_1")!.address;
        
        /* Mint ownershipNFT */
        let block = chain.mineBlock([
            Tx.contractCall("tokenAccess", "mint-ownership-nft", [types.ascii(testURL)], address1)
        ]);

        /* Mint accessNFT */
        block = chain.mineBlock([
            Tx.contractCall("tokenAccess", "mint-data-access-nft", [types.ascii(testURL)], address2)
        ]);
        block.receipts[0].result.expectErr().expectUint(1001);
    },
});

Clarinet.test({
    name: "Can deactivate and reactivate access for accessNFTs when owning the ownershipNFT.",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let address1 = accounts.get("deployer")!.address;
        let address2 = accounts.get("wallet_1")!.address;

        /* Mint ownershipNFT */
        let block = chain.mineBlock([
            Tx.contractCall("tokenAccess", "mint-ownership-nft", [types.ascii(testURL)], address1)
        ]);

        /* Mint accessNFT */
        block = chain.mineBlock([
            Tx.contractCall("tokenAccess", "mint-data-access-nft", [types.ascii(testURL)], address1)
        ]);

        /* Deactivate accessNFTs */
        block = chain.mineBlock([
            Tx.contractCall("tokenAccess", "change-access-nft-activation", [types.ascii(testURL)], address1)
        ]);
        let inner = block.receipts[0].result.expectOk();
        let tuple: any = inner.expectTuple();
        tuple["access-enabled"].expectBool(false);

        /* Reactivate accessNFTs */
        block = chain.mineBlock([
            Tx.contractCall("tokenAccess", "change-access-nft-activation", [types.ascii(testURL)], address1)
        ]);
        inner = block.receipts[0].result.expectOk();
        tuple = inner.expectTuple();
        tuple["access-enabled"].expectBool(true);

        /* Try to deactivate accessNFTs when not the owner of the ownershipNFT */
        block = chain.mineBlock([
            Tx.contractCall("tokenAccess", "change-access-nft-activation", [types.ascii(testURL)], address2)
        ]);
        block.receipts[0].result.expectErr().expectUint(1001);
    },
});

Clarinet.test({
    name: "Can send an accessNFT to another address.",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let address1 = accounts.get("deployer")!.address;
        let address2 = accounts.get("wallet_1")!.address;

        /* Mint ownershipNFT */
        let block = chain.mineBlock([
            Tx.contractCall("tokenAccess", "mint-ownership-nft", [types.ascii(testURL)], address1)
        ]);

        /* Mint accessNFT */
        block = chain.mineBlock([
            Tx.contractCall("tokenAccess", "mint-data-access-nft", [types.ascii(testURL)], address1)
        ]);

        /* Retrieve accessNFT owner */
        block = chain.mineBlock([
            Tx.contractCall("tokenAccess", "get-access-nft-owner", [types.uint(1)], address1)
        ]);
        block.receipts[0].result.expectOk().expectPrincipal(address1);

        /* Send accessNFT to another account */
        block = chain.mineBlock([
            Tx.contractCall("accessNFT", "transfer", [types.uint(1), types.principal(address1), types.principal(address2)], address1)
        ]);

        /* Retrieve accessNFT owner */
        block = chain.mineBlock([
            Tx.contractCall("tokenAccess", "get-access-nft-owner", [types.uint(1)], address1)
        ]);
        block.receipts[0].result.expectOk().expectPrincipal(address2);
    },
});
