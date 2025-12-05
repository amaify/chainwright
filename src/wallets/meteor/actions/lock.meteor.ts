import type { Page } from "@playwright/test";
import { homepageSelectors } from "../selectors/homepage-selectors.meteor";

export async function lockWallet(page: Page) {
    const openSidebarMenuButton = page.locator(homepageSelectors.openSidebarMenuButton);
    await openSidebarMenuButton.click();

    const lockButton = page.locator("button:has-text('Lock Wallet')");
    await lockButton.click();
}
