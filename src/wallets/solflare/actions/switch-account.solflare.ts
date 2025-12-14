import type { Page } from "@playwright/test";

export async function switchAccount(page: Page, accountName: string) {
    const openWalletSelectorMenu = page.getByTestId("icon-section-wallet-picker-arrow-right");
    await openWalletSelectorMenu.click();

    const accountElement = page
        .getByTestId("list-item-m-title")
        .filter({ hasText: accountName })
        .locator("xpath=../..");
    const isAccountElementVisible = accountElement.isVisible().catch(() => false);

    if (!isAccountElementVisible) {
        throw new Error(
            `Account "${accountName}" not found. Make sure the account is onboarded or verify the account name.`,
        );
    }

    await accountElement.click();
}
