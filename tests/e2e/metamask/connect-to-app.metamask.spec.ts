import { expect } from "@playwright/test";
import { testDappFixture } from "@/tests/fixture/test-with-metamask-fixture";

const test = testDappFixture;

test("Should connect wallet successfully", async ({ dappPage, metamask }) => {
    const connectWalletButton = dappPage.getByTestId("connect-wallet-button");
    await connectWalletButton.click();

    const dialog = dappPage.getByRole("dialog");
    await expect(dialog).toBeVisible();

    const connectMetamaskButton = dialog.getByRole("button", { name: "MetaMask" });
    await connectMetamaskButton.click();

    await metamask.connectToApp();

    const appConnectedButton = dappPage.getByTestId("wallet-connected-button");
    await expect(appConnectedButton).toBeVisible();

    expect(dappPage).toBeTruthy();
});
