import { expect, type Page } from "@playwright/test";
import { waitForMetaMaskLoad } from "@/utils/wait-for-stable-page";
import { getWalletPasswordFromCache } from "@/utils/wallets/get-wallet-password-from-cache";
import { homepageSelectors, unlockWalletSelectors } from "../selectors/homepage-selectors";

export default async function unlock(page: Page) {
    const walletPassword = await getWalletPasswordFromCache("metamask");

    const inputField = page.getByTestId(unlockWalletSelectors.passwordInput);
    const isWalletOpen = await inputField
        .isVisible()
        .then(() => true)
        .catch(() => false);

    if (!isWalletOpen) {
        console.info("💡 Wallet is already unlocked");
        return;
    }

    await inputField.fill(walletPassword);

    const unlockButton = page.getByTestId(unlockWalletSelectors.unlockButton);
    await expect(unlockButton).toBeVisible();
    await unlockButton.click();

    await waitForMetaMaskLoad(page);

    await expect(page.getByTestId(homepageSelectors.buyButton)).toBeVisible();
    await expect(page.getByTestId(homepageSelectors.swapButton)).toBeVisible();
    await expect(page.getByTestId(homepageSelectors.sendButton)).toBeVisible();
    await expect(page.getByTestId(homepageSelectors.receiveButton)).toBeVisible();
}
