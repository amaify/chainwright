import { type BrowserContext, expect, type Page } from "@playwright/test";
import { sleep } from "@/utils/sleep";
import waitForStablePage from "@/utils/wait-for-stable-page";
import { PhantomProfile } from "./phantom-profile";

export async function getPageFromContextPhantom(context: BrowserContext) {
    const phantom = new PhantomProfile();
    const indexUrl = await phantom.indexUrl();

    /**
     * Phantom MV3 is flaky on startup: sometimes the popup crashes with
     * "Could not establish connection. Receiving end does not exist."
     * Giving it 1s to finish its own internal boot sequence makes the popup stable.
     */
    await sleep(1_000);

    const promptPage = await context.newPage();

    await expect(async () => {
        await promptPage.goto(indexUrl);
        await waitForStablePage(promptPage);
    }).toPass();

    return promptPage;
}

export async function autoClosePhantomNotification(page: Page, isCancelled: () => boolean) {
    const INTERVAL = 1_000;
    let isClosed = false;
    const isNotificationClosed = () => isClosed;

    while (!isCancelled() || !isNotificationClosed()) {
        const _isClosed = isNotificationClosed();

        // Check if notification is closed
        // If it's closed, there's no need to check again
        if (_isClosed) return;

        try {
            const notificationButton = page.locator("div[id='modal'] button:has-text('Got it')");
            const isNotificationButtonVisible = await notificationButton.isVisible().catch(() => false);

            if (isNotificationButtonVisible) {
                await notificationButton.click();
                isClosed = true;
            }
        } catch (error) {
            console.error("[autoClosePhantomNotification]: ", error);
        }

        await sleep(INTERVAL);
    }
}
