import { expect, type Page } from "@playwright/test";
import { homepageSelectors, settingsSelectors } from "../selectors/homepage-selectors.metamask";

export async function openSettings(page: Page) {
    const notificationPopover = page.locator("div:has(> p[data-testid='notifications-tag-counter__unread-dot'])");
    const settingsButton = page.getByTestId(homepageSelectors.openSettingsButton);
    const isNotificationVisible = await notificationPopover.isVisible().catch(() => false);

    if (isNotificationVisible) {
        await notificationPopover.click();
    } else {
        await expect(settingsButton).toBeVisible();
        await settingsButton.click();
    }

    await expect(page.getByTestId(settingsSelectors.settingsMenu)).toBeVisible();
}
