import type { Page } from "@playwright/test";
import { getWalletPasswordFromCache } from "@/utils/wallets/get-wallet-password-from-cache";

export async function unlock(page: Page) {
    const password = await getWalletPasswordFromCache("meteor");
    const passwordInput = page.locator("input[placeholder='Enter Password']");
    const unlockButton = page.locator('button:has-text("Unlock")');

    await passwordInput.fill(password);
    await unlockButton.click();
}
