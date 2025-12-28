import { expect, type Page } from "@playwright/test";
import { settingsSelectors } from "../selectors/homepage-selectors.metamask";
import { openSettings } from "./open-settings.metamask";

export async function lockWallet(page: Page) {
    await openSettings(page);
    const lockButton = page.getByTestId(settingsSelectors.lockButton);

    await expect(lockButton).toBeVisible();
    await lockButton.click();
}
