import type { Locator, Page } from "@playwright/test";
import { accountSelectors, menuSelectors, settingsSelectors } from "../selectors/homepage-selectors.phantom";
import type { RenameAccountArgs } from "../types";

type RenameAccount = RenameAccountArgs & { page: Page };

export async function renameAccount({ page, currentAccountName, newAccountName }: RenameAccount) {
    const openMenuButton = page.getByTestId(menuSelectors.openMenuButton);
    await openMenuButton.click();

    const manageAccountsButton = page.getByTestId(menuSelectors.manageAccountsButton);
    await manageAccountsButton.click();

    const accountsContainer = page.getByTestId(accountSelectors.accountProfileContainer);
    const allAccounts = await accountsContainer.locator("div[data-testid^='manage-accounts-sortable'] div > p").all();
    let currentAccount: Locator | null = null;

    for (const account of allAccounts) {
        const textContent = await account.textContent();

        if (textContent?.toLowerCase() === currentAccountName.toLowerCase()) {
            currentAccount = account;
            break;
        }
    }

    if (!currentAccount) {
        throw new Error(`Account with name "${currentAccountName}" not found`);
    }

    await currentAccount.click();

    const renameAccountButton = page.locator("button:has-text('Account Name')");
    await renameAccountButton.click();

    const accountNameInput = page.locator("input[name='name']");
    await accountNameInput.clear();
    await accountNameInput.fill(newAccountName);

    const saveButton = page.getByTestId("primary-button");
    await saveButton.click();

    const headerBackButton = page.getByTestId("header--back");
    await headerBackButton.click();

    const settingsCloseButton = page.getByTestId(settingsSelectors.closeMenuButton);
    await settingsCloseButton.click();
}
