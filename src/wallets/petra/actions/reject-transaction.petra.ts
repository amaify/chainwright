import { expect, type Page } from "@playwright/test";
import { actionFooterSelectors } from "../selectors/action-footer";

export async function rejectTransaction(page: Page) {
    const cancelButton = page.locator(actionFooterSelectors.cancelButton);
    await expect(cancelButton).toBeEnabled();
    await cancelButton.click();
}
