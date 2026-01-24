import { expect } from "@playwright/test";
import { testDappFixture } from "@/tests/fixture/test-with-keplr-fixture";

const test = testDappFixture;

test("Should connect wallet successfully", async ({ dappPage, keplr }) => {
    const connectWalletButton = dappPage.getByTestId("connect-wallet-button");
    await connectWalletButton.click();
    await keplr.connectToApp();

    const appConnectedButton = dappPage.getByTestId("wallet-connected-button");
    await expect(appConnectedButton).toBeVisible();

    expect(dappPage).toBeTruthy();
});
