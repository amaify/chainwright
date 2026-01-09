import type { Page } from "@playwright/test";
import { popupPageSelectors } from "../selectors/popup-page-selectors.meteor";
import { switchAccount } from "./switch-account.meteor";
import { unlock } from "./unlock.meteor";

/**
 * By default, the last account will be selected. If you want to select a specific account, pass `account` parameter.
 */
export async function connectToApp(page: Page, account?: string) {
    await unlock(page);

    if (account) {
        await switchAccount(page, account);
    }

    await page.locator(popupPageSelectors.connectButton).click();

    const executingTransaction = page.locator("h2:has-text('Executing Transaction')");
    await executingTransaction.waitFor({ state: "attached" });

    await page.waitForEvent("close", {});
}
