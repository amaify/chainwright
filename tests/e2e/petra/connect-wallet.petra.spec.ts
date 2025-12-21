import { expect } from "@playwright/test";
import { testDappFixture } from "@/tests/fixture/test-with-petra-fixture";

const test = testDappFixture;

test("Should connect wallet successfully", async ({ dappPage, petra }) => {
    const connectWalletButton = dappPage.getByTestId("connect-wallet-button");
    await connectWalletButton.click();

    const dialog = dappPage.getByRole("dialog");
    await expect(dialog).toBeVisible();

    const connectPetraButton = dialog.getByTestId("connect-wallet-Petra");
    await connectPetraButton.click();

    await petra.connectToApp();

    const appConnectedButton = dappPage.getByTestId("wallet-connected-button");
    await expect(appConnectedButton).toBeVisible();
    await expect(appConnectedButton).toContainText("0x");

    expect(dappPage).toBeTruthy();
});
