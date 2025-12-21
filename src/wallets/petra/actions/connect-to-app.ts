import type { Page } from "@playwright/test";
import { actionFooterSelectors } from "../selectors/action-footer";
import { switchAccount } from "./switch-account.petra";

/**
 * By default, the last account will be selected. If you want to select a specific account, pass `account` parameter.
 */
export async function connectToApp(page: Page, account?: string) {
    if (account) {
        await switchAccount(page, account);
    }

    await page.locator(actionFooterSelectors.approveButton).click();
}
