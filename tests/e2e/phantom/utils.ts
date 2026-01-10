import { expect, type Page } from "@playwright/test";
import type { Phantom } from "@/wallets/phantom";

export async function connectWallet(dappPage: Page, phantom: Phantom) {
    const connectWalletButton = dappPage.getByTestId("connect-wallet-button");
    const isConnectWalletButtonVisible = await connectWalletButton.isVisible().catch(() => false);

    if (!isConnectWalletButtonVisible) {
        console.info("\n Wallet is already connected");
        return;
    }

    await connectWalletButton.click();
    const dialog = dappPage.getByRole("dialog");
    await expect(dialog).toBeVisible();

    const connectPhantomButton = dialog.getByRole("button", { name: "Phantom" });
    await connectPhantomButton.click();

    await phantom.connectToApp();

    const appConnectedButton = dappPage.getByTestId("wallet-connected-button");
    await expect(appConnectedButton).toBeVisible();
}
