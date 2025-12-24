import { expect, type Page } from "@playwright/test";
import { sleep } from "@/utils/sleep";
import { actionFooterSelectors } from "../selectors/action-selectors.metamask";

export async function cancelTransaction(page: Page) {
    const cancelButton = page.getByTestId(actionFooterSelectors.cancelButton);
    await sleep(1_000);

    await expect(cancelButton).toBeEnabled();
    await cancelButton.click();
}
