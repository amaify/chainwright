import { expect, type Page } from "@playwright/test";
import type { Solflare } from "@/wallets/solflare";

export async function connectWallet(dappPage: Page, solflare: Solflare) {
    const connectWalletButton = dappPage.getByTestId("connect-wallet-button");
    const isConnectWalletButtonVisible = await connectWalletButton.isVisible().catch(() => false);

    if (!isConnectWalletButtonVisible) {
        console.info("\n Wallet is already connected");
        return;
    }

    await connectWalletButton.click();

    const dialog = dappPage.getByRole("dialog");
    await expect(dialog).toBeVisible();

    const connectPhantomButton = dialog.getByRole("button", { name: "Solflare" });
    await connectPhantomButton.click();

    await solflare.connectToApp();
    const appConnectedButton = dappPage.getByTestId("wallet-connected-button");
    await expect(appConnectedButton).toBeVisible();

    expect(dappPage).toBeTruthy();
}
