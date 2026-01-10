import { expect, type Page } from "@playwright/test";
import type { Meteor } from "@/wallets/meteor";

export async function connectWallet(dappPage: Page, meteor: Meteor) {
    const connectWalletButton = dappPage.getByTestId("connect-wallet-button");
    const isConnectWalletButtonVisible = await connectWalletButton.isVisible().catch(() => false);

    if (!isConnectWalletButtonVisible) {
        console.info("\n Wallet is already connected");
        return;
    }

    await connectWalletButton.click();
    const dialog = dappPage.locator("div[class='modal-left']");
    await expect(dialog).toBeVisible();

    const connectMeteorButton = dialog.locator("div[class='options-list']:has-text('Meteor Wallet')");
    await connectMeteorButton.click();

    await meteor.connectToApp();
}
