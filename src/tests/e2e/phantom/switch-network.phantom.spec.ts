import { expect } from "@playwright/test";
import { testWithPhantomFixture } from "@/tests/fixture/test-with-phantom-fixture";

const test = testWithPhantomFixture;

test.describe("Phantom Toggle Testnet Network", () => {
    test("Should toggle testnet network and select the right network", async ({ phantom, phantomPage }) => {
        await phantom.switchNetwork({ mode: "on", chain: "Solana", network: "Solana Testnet" });

        const testnetAlert = phantomPage.getByRole("banner");
        await expect(testnetAlert).toBeVisible();
    });

    test("Should toggle Solana localnet network with the appropriate alert message", async ({
        phantom,
        phantomPage,
    }) => {
        await phantom.switchNetwork({ mode: "on", chain: "Solana", network: "Solana Localnet" });

        const testnetAlert = phantomPage.getByRole("banner");
        await expect(testnetAlert).toBeVisible();
    });

    test("Should toggle testnet on and off", async ({ phantom, phantomPage }) => {
        await phantom.switchNetwork({ mode: "on", chain: "Solana", network: "Solana Testnet" });

        const testnetAlert = phantomPage.getByRole("banner");
        await expect(testnetAlert).toBeVisible();

        await phantom.switchNetwork({ mode: "off" });
        await expect(testnetAlert).not.toBeVisible();
    });
});
