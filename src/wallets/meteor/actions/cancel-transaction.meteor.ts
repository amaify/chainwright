import type { Page } from "@playwright/test";
import { popupPageSelectors } from "../selectors/popup-page-selectors.meteor";
import { unlock } from "./unlock.meteor";

export async function cancelTransaction(page: Page) {
    await unlock(page);

    const cancelTransactionButton = page.locator(popupPageSelectors.cancelButton);
    await cancelTransactionButton.click();
}
