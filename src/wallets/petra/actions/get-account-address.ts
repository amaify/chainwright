import type { Page } from "@playwright/test";

export async function getAccountAddress(page: Page) {
    const copyAddressButton = page.getByRole("button", { name: "Copy Address", exact: true });
    await copyAddressButton.click();

    const address = await page.evaluate(async () => await navigator.clipboard.readText());

    return address;
}
