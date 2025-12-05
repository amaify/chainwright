import type { Page } from "@playwright/test";
import { getWalletPasswordFromCache } from "@/utils/wallets/get-wallet-password-from-cache";
import { unlockWalletSelectors } from "../selectors/homepage-selectors.keplr";

export async function unlock(page: Page) {
    const PASSWORD = await getWalletPasswordFromCache("keplr");
    const passwordInput = page.locator(unlockWalletSelectors.passwordInput);
    await passwordInput.fill(PASSWORD);

    const unlockButton = page.locator(unlockWalletSelectors.unlockButton);
    await unlockButton.click();
}
