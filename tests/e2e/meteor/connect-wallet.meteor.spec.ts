import { expect } from "@playwright/test";
import { testDappFixture } from "@/tests/fixture/test-with-meteor-fixture";

const test = testDappFixture;

test("Should connect wallet successfully", async ({ dappPage, meteor }) => {
    const connectWalletButton = dappPage.getByTestId("connect-wallet-button");
    await connectWalletButton.click();

    const dialog = dappPage.locator("div[class='modal-left']");
    await expect(dialog).toBeVisible();

    const connectMeteorButton = dialog.locator("div[class='options-list']:has-text('Meteor Wallet')");
    await connectMeteorButton.click();

    await meteor.connectToApp();
    const appConnectedButton = dappPage.getByTestId("wallet-connected-button");
    await expect(appConnectedButton).toBeVisible();

    expect(dappPage).toBeTruthy();
});
