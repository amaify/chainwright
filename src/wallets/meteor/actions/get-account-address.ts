import type { Page } from "@playwright/test";

export async function getAccountAddress(page: Page) {
    const headerContainer = page.locator("div:has(button[type='button'][aria-label='open sidebar'])").nth(-2);
    const accountNameContainer = headerContainer.locator("div:has(div > h2)");
    const copyAddressButton = accountNameContainer.locator("div > svg");
    await copyAddressButton.click();

    const address = await page.evaluate(async () => await navigator.clipboard.readText());

    return address;
}
