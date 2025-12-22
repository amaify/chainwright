import { expect } from "@playwright/test";
import { testDappFixture } from "@/tests/fixture/test-with-solflare-fixture";

const test = testDappFixture;

test("Should connect wallet successfully", async ({ dappPage, solflare }) => {
    const connectWalletButton = dappPage.getByTestId("connect-wallet-button");
    await connectWalletButton.click();

    const dialog = dappPage.getByRole("dialog");
    await expect(dialog).toBeVisible();

    const connectPhantomButton = dialog.getByRole("button", { name: "Solflare" });
    await connectPhantomButton.click();

    await solflare.connectToApp();

    const appConnectedButton = dappPage.getByTestId("wallet-connected-button");
    await expect(appConnectedButton).toBeVisible();

    expect(dappPage).toBeTruthy();
});
