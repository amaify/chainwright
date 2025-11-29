import type { Page } from "@playwright/test";
import { onboardingSelectors } from "./selectors/onboard-selectors";
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
    const popoverMenuList = page.locator(popoverLocator);
    const networkButtonOption = popoverMenuList.locator(`> button:has-text('${network}')`);
    await networkButtonOption.click();
}
