import { expect } from "@playwright/test";
import { testWithsolflareFixture } from "@/tests/fixture/test-with-solflare-fixture";

const test = testWithsolflareFixture;

test("Should rename account successfully", async ({ solflare, solflarePage }) => {
    const WALLET_NAME = "Tango";
    await solflare.renameAccount({ currentAccountName: "Main Wallet", newAccountName: WALLET_NAME });

    const activeAccount = solflarePage.getByTestId("section-wallet-picker");
    await expect(activeAccount.getByText(WALLET_NAME)).toBeVisible();
});
