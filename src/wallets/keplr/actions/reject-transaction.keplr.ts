import type { Page } from "@playwright/test";
import { popupPageSelectors } from "../selectors/popup-page-selectors.keplr";

export async function rejectTransaction(page: Page) {
    const rejectButton = page.locator(popupPageSelectors.rejectButton);
    await rejectButton.click();
}
