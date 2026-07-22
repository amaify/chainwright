import type { Page } from "@playwright/test";
import { sleep } from "@/utils/sleep";

export async function autoClosePhantomNotification(page: Page, signal: AbortSignal) {
    const INTERVAL = 300;

    while (!signal.aborted && !page.isClosed()) {
        try {
            const notificationPopupBackButton = page.locator("div[id='modal']").locator("div > svg").first();
            const isNotificationButtonVisible = await notificationPopupBackButton.isVisible().catch(() => false);

            if (isNotificationButtonVisible) {
                await notificationPopupBackButton.click();
                return;
            }
        } catch (error) {
            console.error("[autoClosePhantomNotification]: ", error);
            if (page.isClosed()) return;
        }

        await sleep(INTERVAL);
    }
}
