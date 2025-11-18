import type { Locator, Page } from "@playwright/test";
import { skip } from "@/tests/utils/skip";
import { accountSelectors } from "../selectors/homepage-selectors";

export async function switchAccount(page: Page, accountName: string) {
    const accountMenuButton = page.locator(accountSelectors.accountOptionsMenuButton).first();
    const accountMenutButtonText = (await accountMenuButton.textContent())?.split("Switch wallet")[1]?.split("0x")[0];

    skip(
        !!accountMenutButtonText?.toLowerCase().trim().includes(accountName.toLowerCase().trim()),
        `Already on the account "${accountName}".`,
    );

    await accountMenuButton.click();

    const accountsDialog = page.getByRole("dialog");
    const accountsButton = await accountsDialog.locator("> div > div > button[type='button']").all();

    let targetAccount: Locator | null = null;

    for (const account of accountsButton) {
        const accountText = await account.textContent();
        if (accountText?.toLowerCase()?.trim().includes(accountName.toLowerCase().trim())) {
            targetAccount = account;
            break;
        }
    }

    if (!targetAccount) {
        throw new Error(`Account with name "${accountName}" not found.`);
    }

    await targetAccount.click();
}
