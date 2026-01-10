import type { Page } from "@playwright/test";
import { popupPageSelectors } from "../selectors/popup-page-selectors.keplr";

export async function confirmTransaction(page: Page) {
    const approveButton = page.locator(popupPageSelectors.approveButton);
    await approveButton.click();
}
