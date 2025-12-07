import { expect } from "@playwright/test";
import { testWithPhantomFixture } from "@/tests/fixture/test-with-phantom-fixture";

const test = testWithPhantomFixture;

test.describe("Phantom Get Account Address Test", () => {
    test("Should get the current account address for Ethereum", async ({ phantom }) => {
        const ACCOUNT_ADDRESS = "0xa8dC5724e9e2dA6041Ec614138af7f6084589990";
        await phantom.addAccount({
            accountName: "Ruka",
            chain: "Ethereum",
            privateKey: "db8b55484c15a6caa975c300345afadda6d8dffac951175282fc8cf136a4d83a",
        });

        const accountAddress = await phantom.getAccountAddress({ accountName: "Ruka", chain: "Polygon" });
        expect(accountAddress).toBe(ACCOUNT_ADDRESS);
    });

    test("Should get the current account address for Solana", async ({ phantom }) => {
        const ACCOUNT_ADDRESS = "3EZLUndpNGpXxGNo1Fa44K6L7UVnXBXWk5kCuf2v5Wtw";

        const accountAddress = await phantom.getAccountAddress({ accountName: "Default", chain: "Solana" });
        expect(accountAddress).toBe(ACCOUNT_ADDRESS);
    });
});
