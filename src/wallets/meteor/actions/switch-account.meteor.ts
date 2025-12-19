import type { Locator, Page } from "@playwright/test";
import { homepageSelectors } from "../selectors/homepage-selectors.meteor";

export async function switchAccount(page: Page, accountName: string) {
    // Make sure that the active account is the one we want to switch to
    const headerContainer = page.locator("div:has(button[type='button'][aria-label='open sidebar'])").nth(-2);
    const accountNameContainer = headerContainer.locator("div:has(div > h2)");
    const activeAccountName = await accountNameContainer.locator("div > h2").textContent();

    if (activeAccountName?.toLowerCase() === accountName.toLowerCase()) {
        console.info(`\n Switching to the ${accountName} account aborted. Account is already selected.`);
        return;
    }

    const sidebarMenuButton = page.locator(homepageSelectors.openSidebarMenuButton);
    await sidebarMenuButton.click();

    const sidebarMenu = page.locator("div:has(div > button[type='button'][aria-label='Close'])").nth(-2);
    const accountsContainer = sidebarMenu.locator("div").nth(2).locator("> div").nth(1).locator("div").nth(1);
    const allAccounts = await accountsContainer.locator("div > h2").all();

    let accountToSelect: Locator | null = null;
    for (const account of allAccounts) {
        const textContent = await account.textContent();
        if (textContent?.toLowerCase() === accountName.toLowerCase()) {
            accountToSelect = account;
            break;
        }
    }

    if (!accountToSelect) {
        throw new Error(`Account with name "${accountName}" not found.`);
    }

    await accountToSelect.click();
}
