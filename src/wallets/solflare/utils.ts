import type { Page } from "@playwright/test";
import { sleep } from "@/utils/sleep";

export async function autoCloseSolflareNotification(page: Page, signal: AbortSignal) {
    const INTERVAL = 150;

    while (!signal.aborted && !page.isClosed()) {
        try {
            const notificationPopupCloseButton = page
                .locator("div[role='dialog']")
                .locator("button[data-testid='icon-btn-whats-new-modal-close']");

            const isNotificationPopupCloseButtonVisisble = await notificationPopupCloseButton
                .isVisible()
                .catch(() => false);

            if (isNotificationPopupCloseButtonVisisble) {
                await notificationPopupCloseButton.click();
                return;
            }
        } catch (error) {
            console.error("[autoCloseSolflareNotification]: ", error);
        }

        await sleep(INTERVAL);
    }
}
