import type { Page } from "@playwright/test";
import { popupPageSelectors } from "../selectors/popup-page-selectors.meteor";
import { unlock } from "./unlock.meteor";

export async function confirmTransaction(page: Page) {
    await unlock(page);

    const approveTransactionButton = page.locator(popupPageSelectors.approveButton);
    await approveTransactionButton.click();

    const executingTransaction = page.locator("h2:has-text('Executing Transaction')");
    await executingTransaction.waitFor({ state: "attached" });

    await page.waitForEvent("close", { timeout: 15_000 });
}
