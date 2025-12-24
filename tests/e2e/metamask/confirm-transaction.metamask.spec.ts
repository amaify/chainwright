import { expect } from "@playwright/test";
import { testDappFixture } from "@/tests/fixture/test-with-metamask-fixture";
import { fillForm } from "@/tests/utils/transaction-form";

const test = testDappFixture;

test("Should confirm transaction successfully", async ({ dappPage, metamask }) => {
    const connectWalletButton = dappPage.getByTestId("connect-wallet-button");
    await connectWalletButton.click();

    const dialog = dappPage.getByRole("dialog");
    await expect(dialog).toBeVisible();

    const connectMetamaskButton = dialog.getByRole("button", { name: "MetaMask" });
    await connectMetamaskButton.click();

    await metamask.connectToApp();

    const appConnectedButton = dappPage.getByTestId("wallet-connected-button");
    await expect(appConnectedButton).toBeVisible();

    const ADDRESS = "0xa8dC5724e9e2dA6041Ec614138af7f6084589990";
    await fillForm({ appPage: dappPage, walletAddress: ADDRESS, amount: "0.00001" });

    await metamask.confirmTransaction();
});
