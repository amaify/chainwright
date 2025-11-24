import type { Page } from "@playwright/test";
import { getWalletPasswordFromCache } from "@/utils/wallets/get-wallet-password-from-cache";

export async function unlock(page: Page) {
    const walletPassword = await getWalletPasswordFromCache("phantom");

    const unlockInput = page.locator("input[name='password']");
    const unlockButton = page.getByTestId("unlock-form-submit-button");

    await unlockInput.fill(walletPassword);
    await unlockButton.click();
    await unlockButton.waitFor({ state: "detached" });

    const notificationButton = page.locator("div[id='modal'] button:has-text('Got it')");
    await notificationButton.waitFor({ state: "attached", timeout: 15_000 }).catch(() => {});
    const isNotificationButtonVisible = await notificationButton.isVisible().catch(() => false);

    if (isNotificationButtonVisible) {
        await notificationButton.click();
    }
}
