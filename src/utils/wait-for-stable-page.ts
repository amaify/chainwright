import type { Page } from "@playwright/test";

const TIMEOUT = 15_000;

export default async function waitForStablePage(page: Page) {
    await page.waitForLoadState("load", { timeout: TIMEOUT });
    await page.waitForLoadState("domcontentloaded", { timeout: TIMEOUT });
}
