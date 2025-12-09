import type { Page } from "@playwright/test";
import { type RenameAccountArgs, renameAccountSchema } from "../types";

type RenameAccount = RenameAccountArgs & { page: Page };

export async function renameAccount({ page, currentAccountName, newAccountName }: RenameAccount) {
    const parsedData = renameAccountSchema.parse({ currentAccountName, newAccountName });

    const settingsButton = page.getByRole("link", { name: "Settings", exact: true });
    await settingsButton.click();

    const activeAccount = page.locator("div[cursor='pointer']").first();
    await activeAccount.click();

    const accountList = page.locator(`div`, { hasText: parsedData.currentAccountName }).nth(-4);
    const isAccountListVisible = await accountList.isVisible().catch(() => false);
    if (!isAccountListVisible) {
        throw Error(`Account with name "${parsedData.currentAccountName}" not found`);
    }

    const popoverTrigger = accountList.locator("div[cursor='pointer'] svg");
    await popoverTrigger.click();

    const changeAccountNameButton = page
        .locator("div > div[cursor='pointer'] > div:has-text('Change Wallet Name')")
        .last();
    await changeAccountNameButton.click();

    const newWalletNameInput = page.locator("input[name='name']");
    await newWalletNameInput.fill(parsedData.newAccountName);

    const saveButton = page.locator("button:has-text('Save')");
    await saveButton.click();
}
