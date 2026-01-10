import type { Page } from "@playwright/test";
import type { Keplr } from "@/wallets/keplr";

export async function connectWallet(dappPage: Page, keplr: Keplr) {
    const connectWalletButton = dappPage.getByTestId("connect-wallet-button");
    const isConnectWalletButtonVisible = await connectWalletButton.isVisible().catch(() => false);

    if (!isConnectWalletButtonVisible) {
        console.info("\n Wallet is already connected");
        return;
    }

    await connectWalletButton.click();
    await keplr.connectToApp();
}
