import type { BrowserContext, Page } from "@playwright/test";
import { sleep } from "../sleep";

type GetPopupPageFromContextArgs = {
    context: BrowserContext;
    path: string;
    locator: string;
};

export async function getPopupPageFromContext({ context, path, locator }: GetPopupPageFromContextArgs) {
    await sleep(500);
    const isPopupPage = (page: Page) => page.url().includes(path);

    // Check if prompt page is already open.
    let popupPage = context.pages().find(isPopupPage);

    if (!popupPage) {
        popupPage = await context.waitForEvent("page", {
            predicate: isPopupPage,
            timeout: 50_000,
        });
    }

    await waitForStablePage(popupPage, locator);

    // Set pop-up window viewport size to resemble the actual Wallet's pop-up window.
    await popupPage.setViewportSize({
        width: 360,
        height: 592,
    });

    return popupPage;
}

async function waitForStablePage(page: Page, locator: string) {
    const TIMEOUT = 15_000;
    await page.waitForLoadState("load", { timeout: TIMEOUT });
    await page.waitForLoadState("domcontentloaded", { timeout: TIMEOUT });

    const domContent = page.locator(locator);
    await domContent.waitFor({ state: "visible", timeout: TIMEOUT });
}
