import type { Page } from "@playwright/test";
import { homepageSelectors } from "../selectors/homepage-selectors.meteor";

export async function openSettings(page: Page) {
    const sidebarMenuButton = page.locator(homepageSelectors.openSidebarMenuButton);
    await sidebarMenuButton.click();

    const settingsButton = page.locator(homepageSelectors.settingsButton);
    await settingsButton.click();
}
