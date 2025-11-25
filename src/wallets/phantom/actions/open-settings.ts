import type { Page } from "@playwright/test";
import { menuSelectors } from "../selectors/homepage-selectors";

export async function openSettings(page: Page) {
    const openMenuButton = page.getByTestId(menuSelectors.openMenuButton);
    await openMenuButton.click();

    const settingsButton = page.getByTestId(menuSelectors.settingsButton);
    await settingsButton.click();
}
