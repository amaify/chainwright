import { expect } from "@playwright/test";
import { phantomWorkerScopeFixture } from "@/wallets/phantom/phantom-worker-scope-fixture";

const test = phantomWorkerScopeFixture();

test.describe("Phantom Get Account Address Test", () => {
    test("Should get the current account address for Ethereum", async ({ phantom }) => {
        const ACCOUNT_ADDRESS = "0x2983f6613cA0f3ab1049E3801CBb837226f154De";
        await phantom.addAccount({
            accountName: "Ruka",
            chain: "Ethereum",
            privateKey: "0x28441de33adac31d474f08119cd1af56ddbdc77f111e9c7e186bb52c3bc2eceb",
        });

        const accountAddress = await phantom.getAccountAddress({
            accountName: "Ruka",
            chain: {
                mode: "testnet",
                network: "Sepolia",
            },
        });
        expect(accountAddress).toBe(ACCOUNT_ADDRESS);
    });

    test("Should get the current account address for Solana", async ({ phantom }) => {
        const ACCOUNT_ADDRESS = "3EZLUndpNGpXxGNo1Fa44K6L7UVnXBXWk5kCuf2v5Wtw";

        const accountAddress = await phantom.getAccountAddress({
            accountName: "Zebra",
            chain: {
                mode: "testnet",
                network: "Devnet",
            },
        });
        expect(accountAddress).toBe(ACCOUNT_ADDRESS);
    });
});
