import { expect } from "@playwright/test";
import { testDappFixture } from "@/tests/fixture/test-with-phantom-fixture";

const test = testDappFixture;

test("Should connect wallet successfully", async ({ dappPage, phantom }) => {
    const connectWalletButton = dappPage.getByTestId("connect-wallet-button");
    await connectWalletButton.click();

    const dialog = dappPage.getByRole("dialog");
    await expect(dialog).toBeVisible();

    const connectPhantomButton = dialog.getByRole("button", { name: "Phantom" });
    await connectPhantomButton.click();

    await phantom.connectToApp();

    const appConnectedButton = dappPage.getByTestId("wallet-connected-button");
    await expect(appConnectedButton).toBeVisible();
});
