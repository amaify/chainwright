import type { Locator, Page } from "@playwright/test";
import z from "zod";
import { menuSelectors } from "../selectors/homepage-selectors";

export async function switchAccount(page: Page, accountName: string) {
    const parsedAccountName = z.string().min(1, "Account name cannot be an empty string").parse(accountName);

    const openMenuButton = page.getByTestId(menuSelectors.openMenuButton);
    await openMenuButton.click();

    let accountListButton: Locator | null = null;
    const accountButton = await page
        .locator(`div[data-testid='account-menu'] div[data-testid='tooltip_interactive-wrapper']`)
        .all();

    for (const account of accountButton) {
        const textContent = await account.textContent();
        if (textContent?.includes(parsedAccountName)) {
            accountListButton = account;
            break;
        }
    }

    if (!accountListButton) {
        throw new Error(`Account with name "${parsedAccountName}" not found in the account list.`);
    }

    await accountListButton.click();
}
