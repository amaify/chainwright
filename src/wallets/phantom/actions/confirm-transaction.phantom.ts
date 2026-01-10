import type { Page } from "@playwright/test";
import { actionFooterSelectors } from "../selectors/action-footers.phantom";

export async function confirmTransaction(page: Page) {
    const confirmButton = page.getByTestId(actionFooterSelectors.confirmButton);
    const approveTransactionContainer = page.getByTestId("approve-transaction");
    await approveTransactionContainer.waitFor({ state: "attached" });

    const confirmAnywayButton = page.getByRole("button", { name: "Confirm anyway", exact: true });
    const isConfirmAnywayButtonVisible = await confirmAnywayButton.isVisible().catch(() => false);

    if (isConfirmAnywayButtonVisible) {
        await confirmAnywayButton.click();
        return;
    }

    await confirmButton.click();
}
