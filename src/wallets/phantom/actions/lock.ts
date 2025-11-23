import type { Page } from "@playwright/test";
import { menuSelectors, settingsSelectors } from "../selectors/homepage-selectors";

export async function lockWallet(page: Page) {
    const openMenuButton = page.getByTestId(menuSelectors.openMenuButton);
    await openMenuButton.click();

    const settingsButton = page.getByTestId(menuSelectors.settingsButton);
    await settingsButton.click();

    const lockWalletButton = page.getByTestId(settingsSelectors.lockWalletButton);
    await lockWalletButton.click();
}
