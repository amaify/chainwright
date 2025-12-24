import { expect, type Page } from "@playwright/test";
import { sleep } from "@/utils/sleep";
import { actionFooterSelectors } from "../selectors/action-selectors.metamask";

export async function confirmTransaction(page: Page) {
    const confirmButton = page.getByTestId(actionFooterSelectors.confirmButton);
    await sleep(1_000);

    const confirmButtonTextContent = await confirmButton.textContent();
    const isReviewAlertVisible = !!confirmButtonTextContent?.includes("Review alert");

    if (isReviewAlertVisible && (await confirmButton.isDisabled())) {
        const networkFeeContainer = page.getByTestId("edit-gas-fees-row");
        const networkFee = networkFeeContainer.locator("> div").first();
        await networkFee.click();

        const networkFeeAlertDialog = page.getByRole("dialog");
        await expect(networkFeeAlertDialog).toBeVisible();

        const networkFeeAlertTitle = networkFeeAlertDialog.locator("h4", { hasText: "Insufficient funds" });
        const alertMessage = await networkFeeAlertDialog.getByTestId("alert-modal__selected-alert").textContent();
        const isInsufficientFundsAlertVisible = await networkFeeAlertTitle.isVisible().catch(() => false);

        if (isInsufficientFundsAlertVisible) {
            throw Error(`${alertMessage}`);
        }
    }

    await expect(confirmButton).toBeEnabled();
    await confirmButton.click();
}
