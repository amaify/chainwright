import type { Page } from "@playwright/test";
import { onboardingSelectors } from "./selectors/onboard-selectors.meteor";
import type { MeteorNetwork } from "./types";
export async function switchNetworkUtil(page: Page, network: MeteorNetwork, popoverLocator: string) {
    const switchNetworkButton = page.locator(onboardingSelectors.switchNetworkButton).last();
    await switchNetworkButton.scrollIntoViewIfNeeded();

    const currentNetwork = await switchNetworkButton.textContent();
    const currentNetworkPassed = network.split("net")[0]?.toLowerCase() ?? "";

    if (currentNetwork?.toLowerCase() === currentNetworkPassed) {
        console.info(`\n Already on ${network}, no need to switch network.`);
        return "Exit";
    }

    await switchNetworkButton.click();
    const popoverMenuList = page.locator(popoverLocator).last();
    const networkButtonOption = popoverMenuList.locator(`> button:has-text('${network}')`);
    await networkButtonOption.click();

    const meteorCommunityText = page.locator("div > h2:has-text('Meteor Community')");
    const isMeteorCommunityVisible = await meteorCommunityText.isVisible().catch(() => false);

    // If the Meteor Community button is visible, click the network button option again
    if (isMeteorCommunityVisible) {
        await networkButtonOption.click();
    }
}
