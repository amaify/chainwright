import type { Page } from "@playwright/test";
import { settingsMenuSelectors } from "../selectors/homepage-selectors.solflare";
import { openSettings } from "./open-settings.solflare";

export async function lockWallet(page: Page) {
    await openSettings(page);

    const securityAndPrivacyButton = page.getByTestId(settingsMenuSelectors.securityAndPrivacyButton);
    await securityAndPrivacyButton.click();

    const lockButtonContainer = page.getByTestId("li-settings-lock");
    const lockButton = lockButtonContainer.getByTestId(settingsMenuSelectors.lockButton);
    await lockButton.click();
}
