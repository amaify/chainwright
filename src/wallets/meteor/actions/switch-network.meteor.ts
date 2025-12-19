import type { Page } from "@playwright/test";
import { sleep } from "@/utils/sleep";
import { homepageSelectors } from "../selectors/homepage-selectors.meteor";
import type { MeteorNetwork } from "../types";
import { switchNetworkUtil } from "../utils";
import { openSettings } from "./open-settings.meteor";

export async function switchNetwork(page: Page, network: MeteorNetwork) {
    await openSettings(page);

    const result = await switchNetworkUtil(page, network, "div[role='menu']");

    if (result === "Exit") {
        const backButton = page.locator(homepageSelectors.settingsMenuBackButton);
        await backButton.scrollIntoViewIfNeeded();
        await backButton.click();
        return;
    }

    const availableBalance = page.locator("p:has-text('Available Balance')");
    await sleep(1_000);
    const isAvailableBalanceVisible = await availableBalance.isVisible().catch(() => false);
    if (!isAvailableBalanceVisible) {
        throw new Error(
            [
                `There is no associated account for the ${network} network in your wallet.`,
                `Please add an account to the ${network} network in your wallet using the "addAccount" method.`,
                "NOTE: For the account to be persisted across tests, do this when onboarding the wallet.",
            ].join("\n"),
        );
    }
}
