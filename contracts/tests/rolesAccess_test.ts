import { Clarinet, Tx, Chain, Account, types } from "https://deno.land/x/clarinet@v1.4.2/index.ts";
import { assertEquals } from "https://deno.land/std@0.178.0/testing/asserts.ts";

let testURL = "https://gaia.blockstack.org/hub/1NkTNTS6VhP2VEVyU84w3spmYgk2bi8tRp/test.txt";

Clarinet.test({
    name: "Can add and read data-owner for a URL.",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let address1 = accounts.get("deployer")!.address;

        /* Add new owner */
        let block = chain.mineBlock([
            Tx.contractCall("rolesAccess", "add-data-owner", [types.ascii(testURL)], address1)
        ]);
        let inner = block.receipts[0].result.expectOk();
        let tuple: any = inner.expectTuple();
        tuple["data-owner"].expectPrincipal(address1); /* Can also check the same with assertEquals. What is better?*/
        assertEquals(tuple["data-owner"], address1);
        tuple["url"].expectAscii(testURL);
    },
});

Clarinet.test({
    name: "Cannot add another data-owner.",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let address1 = accounts.get("deployer")!.address;
        let address2 = accounts.get("wallet_1")!.address;

        /* Add new owner */
        let block = chain.mineBlock([
            Tx.contractCall("rolesAccess", "add-data-owner", [types.ascii(testURL)], address1)
        ]);

        /* Try to add another owner */
        block = chain.mineBlock([
            Tx.contractCall("rolesAccess", "add-data-owner", [types.ascii(testURL)], address2)
        ]);
        block.receipts[0].result.expectErr().expectUint(1002);
    },
});

Clarinet.test({
    name: "Can remove a data-owner for a URL.",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let address1 = accounts.get("deployer")!.address;

        /* Add new owner */
        let block = chain.mineBlock([
            Tx.contractCall("rolesAccess", "add-data-owner", [types.ascii(testURL)], address1)
        ]);

        /* Remove owner */
        block = chain.mineBlock([
            Tx.contractCall("rolesAccess", "remove-data-owner", [types.ascii(testURL)], address1)
        ]);
        let inner = block.receipts[0].result.expectOk();
        let tuple: any = inner.expectTuple();
        tuple["data-owner"].expectPrincipal(address1);
        tuple["url"].expectAscii(testURL);

        /* Try to remove owner when there is no entry */
        block = chain.mineBlock([
            Tx.contractCall("rolesAccess", "remove-data-owner", [types.ascii(testURL)], address1)
        ]);
        block.receipts[0].result.expectErr().expectUint(1005);;      
    },
});

Clarinet.test({
    name: "Can add up to ten new data-accessors.",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let address1 = accounts.get("deployer")!.address;
        let address2 = accounts.get("wallet_1")!.address;
        let address3 = accounts.get("wallet_2")!.address;
        let address4 = accounts.get("wallet_3")!.address;
        let address5 = accounts.get("wallet_4")!.address;
        let address6 = accounts.get("wallet_5")!.address;
        let address7 = accounts.get("wallet_6")!.address;
        let address8 = accounts.get("wallet_7")!.address;
        let address9 = accounts.get("wallet_8")!.address;
        let address10 = accounts.get("wallet_9")!.address;

        /* Add new owner */
        let block = chain.mineBlock([
            Tx.contractCall("rolesAccess", "add-data-owner", [types.ascii(testURL)], address1)
        ]);

        /* Add new data-accessor */
        block = chain.mineBlock([
            Tx.contractCall("rolesAccess", "add-data-accessor", [types.ascii(testURL), types.principal(address2)], address1)
        ]);
        let inner = block.receipts[0].result.expectOk();
        let tuple: any = inner.expectTuple();
        tuple["data-accessor"].expectPrincipal(address2);
        tuple["url"].expectAscii(testURL);

        /* Add new data-accessor */
        block = chain.mineBlock([
            Tx.contractCall("rolesAccess", "add-data-accessor", [types.ascii(testURL), types.principal(address3)], address1)
        ]);
        inner = block.receipts[0].result.expectOk();
        tuple = inner.expectTuple();
        tuple["data-accessor"].expectPrincipal(address3);
        tuple["url"].expectAscii(testURL);

        /* Add eight more data-accessors */
        block = chain.mineBlock([
            Tx.contractCall("rolesAccess", "add-data-accessor", [types.ascii(testURL), types.principal(address4)], address1)
        ]);
        block = chain.mineBlock([
            Tx.contractCall("rolesAccess", "add-data-accessor", [types.ascii(testURL), types.principal(address5)], address1)
        ]);
        block = chain.mineBlock([
            Tx.contractCall("rolesAccess", "add-data-accessor", [types.ascii(testURL), types.principal(address6)], address1)
        ]);
        block = chain.mineBlock([
            Tx.contractCall("rolesAccess", "add-data-accessor", [types.ascii(testURL), types.principal(address7)], address1)
        ]);
        block = chain.mineBlock([
            Tx.contractCall("rolesAccess", "add-data-accessor", [types.ascii(testURL), types.principal(address8)], address1)
        ]);
        block = chain.mineBlock([
            Tx.contractCall("rolesAccess", "add-data-accessor", [types.ascii(testURL), types.principal(address9)], address1)
        ]);
        block = chain.mineBlock([
            Tx.contractCall("rolesAccess", "add-data-accessor", [types.ascii(testURL), types.principal("ST12KV4C80N0FN2B3JVPB8ZTVEXCXETYHB10WMQB9")], address1)
        ]);
        block = chain.mineBlock([
            Tx.contractCall("rolesAccess", "add-data-accessor", [types.ascii(testURL), types.principal("ST32SMX34VSNJ8DZE88JDT067Y98THRC5XBGS5S69")], address1)
        ]);

        /* Try to add 11th data-accessor */
        block = chain.mineBlock([
            Tx.contractCall("rolesAccess", "add-data-accessor", [types.ascii(testURL), types.principal("ST36K3XANWMRK91VZRE4EQMKSPMEN24N9EBG4TTJD")], address1)
        ]);
        block.receipts[0].result.expectErr().expectUint(1004);;     
    },
});


Clarinet.test({
    name: "Cannot add a the same data-accessor twice",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let address1 = accounts.get("deployer")!.address;
        let address2 = accounts.get("wallet_1")!.address;
        let address3 = accounts.get("wallet_2")!.address;

        /* Add new owner */
        let block = chain.mineBlock([
            Tx.contractCall("rolesAccess", "add-data-owner", [types.ascii(testURL)], address1)
        ]);

        /* Add new data-accessor */
        block = chain.mineBlock([
            Tx.contractCall("rolesAccess", "add-data-accessor", [types.ascii(testURL), types.principal(address2)], address1)
        ]);

        /* Try to add same data-accessor again */
        block = chain.mineBlock([
            Tx.contractCall("rolesAccess", "add-data-accessor", [types.ascii(testURL), types.principal(address2)], address1)
        ]);
        block.receipts[0].result.expectErr().expectUint(1002);
    },
});

Clarinet.test({
    name: "Cannot add a new data-accessor when calling address is not the data-owner.",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let address1 = accounts.get("deployer")!.address;
        let address2 = accounts.get("wallet_1")!.address;
        let address3 = accounts.get("wallet_2")!.address;

        /* Add owner */
        let block = chain.mineBlock([
            Tx.contractCall("rolesAccess", "add-data-owner", [types.ascii(testURL)], address1)
        ]);

        /* Try to add new data-accessor, calling address is not address1 */
        block = chain.mineBlock([
            Tx.contractCall("rolesAccess", "add-data-accessor", [types.ascii(testURL), types.principal(address2)], address3)
        ]);
        block.receipts[0].result.expectErr().expectUint(1001);
    },
});

Clarinet.test({
    name: "Can remove data-accessors.",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let address1 = accounts.get("deployer")!.address;
        let address2 = accounts.get("wallet_1")!.address;
        let address3 = accounts.get("wallet_2")!.address;

        /* Add owner */
        let block = chain.mineBlock([
            Tx.contractCall("rolesAccess", "add-data-owner", [types.ascii(testURL)], address1)
        ]);
        
        /* Add new data-accessor */
        block = chain.mineBlock([
            Tx.contractCall("rolesAccess", "add-data-accessor", [types.ascii(testURL), types.principal(address2)], address1)
        ]);

        /* Add another data-accessor */
        block = chain.mineBlock([
            Tx.contractCall("rolesAccess", "add-data-accessor", [types.ascii(testURL), types.principal(address3)], address1)
        ]);

        /* Remove data-accessors */
        block = chain.mineBlock([
            Tx.contractCall("rolesAccess", "remove-data-accessors", [types.ascii(testURL)], address1)
        ]);
        let inner = block.receipts[0].result.expectOk();
        let tuple: any = inner.expectTuple();
        tuple["event"].expectAscii("all accessors deleted");
        tuple["url"].expectAscii(testURL);
    },
});
