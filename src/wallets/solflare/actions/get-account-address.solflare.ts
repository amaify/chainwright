import type { Page } from "@playwright/test";

export async function getAccountAddress(page: Page) {
    const copyAddressButton = page.getByTestId("icon-section-wallet-picker-copy");
    await copyAddressButton.click();

    const address = await page.evaluate(async () => await navigator.clipboard.readText());
    return address;
}
