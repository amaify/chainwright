import { expect, type Page } from "@playwright/test";
import { actionFooterSelectors } from "../selectors/action-footer";

export async function confirmTransaction(page: Page) {
    const approveButton = page.locator(actionFooterSelectors.approveButton);
    await expect(approveButton).toBeEnabled();
    await approveButton.click();
}
