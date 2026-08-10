import type { Locator, Page } from "@playwright/test";
import { menuSelectors } from "../selectors/homepage-selectors.phantom";

export async function switchAccount(page: Page, accountName: string) {
    const openMenuButton = page.getByTestId(menuSelectors.openMenuButton);
    await openMenuButton.click();

    let accountListButton: Locator | null = null;
    const accountButton = await page
        .locator(`div[data-testid='account-menu'] div[data-testid='tooltip_interactive-wrapper']`)
        .all();

    for (const account of accountButton) {
        const textContent = await account.textContent();
        if (textContent?.includes(accountName)) {
            accountListButton = account;
            break;
        }
    }

    if (!accountListButton) {
        throw new Error(`Account with name "${accountName}" not found in the account list.`);
    }

    await accountListButton.click();
}
