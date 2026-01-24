import { expect, type Page } from "@playwright/test";
import { sleep } from "@/utils/sleep";
import { actionFooterSelectors } from "../selectors/action-selectors.metamask";
import type { GasFeeSettings } from "../types";

export async function confirmTransaction(page: Page, gasFee?: GasFeeSettings) {
    const confirmButton = page.getByTestId(actionFooterSelectors.confirmButton);
    await sleep(2_000);

    const confirmButtonTextContent = await confirmButton.textContent();
    const isReviewAlertVisible = confirmButtonTextContent?.includes("Review alert");
    const isConfirmButtonDisabled = await confirmButton.isDisabled().catch(() => false);

    if (isReviewAlertVisible && isConfirmButtonDisabled) {
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

    if (gasFee) {
        const editGasFeeButton = page.getByTestId("edit-gas-fee-icon");
        await editGasFeeButton.scrollIntoViewIfNeeded();
        await editGasFeeButton.click();

        if (gasFee.feeType !== "advanced") {
            const feeOptionButton = page.getByTestId(`gas-option-${gasFee.feeType}`);
            await feeOptionButton.click();
        }

        if (gasFee.feeType === "advanced") {
            const advanceGasFeeButton = page.getByTestId("gas-option-advanced");
            await advanceGasFeeButton.click();

            const baseFeeInput = page.getByRole("textbox", { name: "Max base fee" });
            const priorityFeeInput = page.getByRole("textbox", { name: "Priority fee" });
            const saveButton = page.getByRole("button", { name: "Save", exact: true });

            await baseFeeInput.fill(gasFee.maxBaseFee);
            await priorityFeeInput.fill(gasFee.priorityFee);
            await saveButton.click();
        }
    }

    // Confirm the transaction
    await expect(confirmButton).toBeEnabled();
    await confirmButton.click();

    // Handle potential risk warning dialog.
    const confirmDialog = page.getByRole("dialog");
    const isConfirmDialogVisible = await confirmDialog.isVisible().catch(() => false);

    if (isConfirmDialogVisible) {
        const riskWarningHeader = confirmDialog.locator("h4", { hasText: "Your assets may be at risk" });
        const isRiskWarningVisible = await riskWarningHeader.isVisible().catch(() => false);

        if (isRiskWarningVisible) {
            const acknowledgeAndProceedCheckbox = confirmDialog.getByTestId("alert-modal-acknowledge-checkbox");
            await acknowledgeAndProceedCheckbox.click();

            const alertConfirmButton = confirmDialog.getByTestId("confirm-alert-modal-submit-button");
            await alertConfirmButton.click();
        }
    }
}
