import { expect, type Page } from "@playwright/test";
import { popupPageSelectors } from "../selectors/popup-page-selectors.solflare";

export async function confirmTransaction(page: Page) {
    const approveButton = page.getByTestId(popupPageSelectors.approveButton);
    const networkFeeSection = page.getByTestId("section-network-fee");
    await networkFeeSection.waitFor({ state: "attached" });

    const controlLabelText = page.locator("div[data-id='control-label']");
    const isControlLabelTextVisible = await controlLabelText.isVisible().catch(() => false);

    if (isControlLabelTextVisible) {
        await controlLabelText.click();
    }

    await expect(approveButton).toBeEnabled();
    await approveButton.click();
}
