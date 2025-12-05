import { expect, type Page } from "@playwright/test";
import { settingsSelectors } from "../selectors/homepage-selectors.metamask";

export async function lockWallet(page: Page) {
    const lockButton = page.getByTestId(settingsSelectors.lockButton);

    await expect(lockButton).toBeVisible();
    await lockButton.click();
}
