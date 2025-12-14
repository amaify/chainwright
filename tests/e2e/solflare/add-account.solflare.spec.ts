import { expect } from "@playwright/test";
import { testWithsolflareFixture } from "@/tests/fixture/test-with-solflare-fixture";

const PRIVATE_KEY = [
    82, 178, 133, 28, 145, 22, 89, 191, 242, 59, 104, 247, 77, 175, 61, 214, 196, 11, 55, 24, 93, 216, 134, 61, 89, 131,
    163, 21, 69, 242, 61, 199, 19, 75, 210, 243, 142, 1, 200, 66, 132, 221, 34, 186, 28, 138, 250, 59, 194, 180, 108, 7,
    236, 243, 112, 99, 38, 199, 125, 22, 213, 218, 46, 13,
];

const test = testWithsolflareFixture;

test("Should add account successfully", async ({ solflare, solflarePage }) => {
    const WALLET_NAME = "Alpha";
    await solflare.addAccount({ privateKey: PRIVATE_KEY, walletName: WALLET_NAME });

    const openWalletSelectorMenu = solflarePage.getByTestId("icon-section-wallet-picker-arrow-right");
    await openWalletSelectorMenu.click();

    await expect(solflarePage.getByText(WALLET_NAME)).toBeVisible();
});
