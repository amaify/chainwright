import type { Page } from "@playwright/test";
import { homepageSelectors } from "../selectors/homepage-selectors";

export async function lockWallet(page: Page) {
    const openMenuButton = page.locator(homepageSelectors.openSidebarMenuButton);
    await openMenuButton.click();

    const lockWalletButton = page.locator(homepageSelectors.lockWalletButton).nth(-1);

    await lockWalletButton.click();
}
