import type { Page } from "@playwright/test";
import { homepageSelectors, settingsMenuSelectors } from "../selectors/homepage-selectors";
import type { SwitchNetwork } from "../types";

export async function switchNetwork(page: Page, networkName: SwitchNetwork) {
    const settingsMenuButton = page.locator(homepageSelectors.settingsMenu);
    await settingsMenuButton.click();

    const networkOptionButton = page.locator(settingsMenuSelectors.networkSection);
    await networkOptionButton.click();

    const networkOption = page.locator(`div:has(> span:has-text("${networkName}"))`).first();
    await networkOption.click();

    const backButton = page.locator(settingsMenuSelectors.backButton);
    await backButton.click();
    await backButton.click();
}
