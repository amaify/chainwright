import { expect, type Page } from "@playwright/test";
import { getWalletPasswordFromCache } from "@/utils/wallets/get-wallet-password-from-cache";
import { homepageSelectors, unlockWalletSelectors } from "../selectors/homepage-selectors";

export default async function unlock(page: Page) {
    const walletPassword = await getWalletPasswordFromCache("petra");

    const inputField = page.locator(unlockWalletSelectors.passwordInput);
    await expect(inputField).toBeVisible({ timeout: 15_000 });
    await inputField.fill(walletPassword);

    const unlockButton = page.locator(unlockWalletSelectors.unlockButton);
    await expect(unlockButton).toBeEnabled();
    await unlockButton.click();

    await expect(page.locator(homepageSelectors.sendButton)).toBeVisible();
    await expect(page.locator(homepageSelectors.receiveButton)).toBeVisible();
}
