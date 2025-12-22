import type { Page } from "@playwright/test";

/**
 * By default, the last account will be selected. If you want to select a specific account, pass `account` parameter.
 */
export async function connectToApp(page: Page) {
    const approveConnectionButton = page.getByRole("button", { name: "Approve", exact: true });

    await approveConnectionButton.click();
}
