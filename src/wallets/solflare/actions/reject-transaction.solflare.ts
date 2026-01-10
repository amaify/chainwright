import type { Page } from "@playwright/test";
import { popupPageSelectors } from "../selectors/popup-page-selectors.solflare";

export async function rejectTransaction(page: Page) {
    const rejectButton = page.getByTestId(popupPageSelectors.rejectButton);
    await rejectButton.click();
}
