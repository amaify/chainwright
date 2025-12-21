import type { BrowserContext, Page } from "@playwright/test";
import waitForStablePage from "../wait-for-stable-page";

export async function getPopupPageFromContext(context: BrowserContext, path: string) {
    const isPopupPage = (page: Page) => page.url().includes(path);

    // Check if prompt page is already open.
    let popupPage = context.pages().find(isPopupPage);

    if (!popupPage) {
        popupPage = await context.waitForEvent("page", {
            predicate: isPopupPage,
            timeout: 50_000,
        });
    }

    await waitForStablePage(popupPage);

    // Set pop-up window viewport size to resemble the actual Phantom pop-up window.
    await popupPage.setViewportSize({
        width: 360,
        height: 592,
    });

    await waitForStablePage(popupPage);

    return popupPage;
}
