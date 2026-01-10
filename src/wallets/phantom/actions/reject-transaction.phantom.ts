import type { Page } from "@playwright/test";
import { actionFooterSelectors } from "../selectors/action-footers.phantom";

export async function rejectTransaction(page: Page) {
    const rejectButton = page.getByTestId(actionFooterSelectors.cancelButton);
    const approveTransactionContainer = page.getByTestId("approve-transaction");
    await approveTransactionContainer.waitFor({ state: "attached" });
    await rejectButton.click();
}
