import { expect, type Page } from "@playwright/test";
import { sleep } from "@/utils/sleep";
import { settingsSelectors } from "../selectors/homepage-selectors.phantom";
import type { SwitchNetwork } from "../types";
import { openSettings } from "./open-settings.phantom";

type SwitchNetworkParams = SwitchNetwork & { page: Page };

export async function switchNetwork({ page, ...args }: SwitchNetworkParams) {
    await openSettings(page);

    const developerSettingsButton = page.locator(`button[id='${settingsSelectors.developerSettingsButton}']`);
    await developerSettingsButton.scrollIntoViewIfNeeded();
    await developerSettingsButton.click();

    const developerSettingsMenu = page.locator("div", { has: page.locator("button[data-testid='toggleTestNetwork']") });
    const toggleTestnetButton = page.getByTestId("toggleTestNetwork");
    const toggleTestnetSwitch = toggleTestnetButton.locator(
        "label[data-testid='toggleTestNetwork-switch'] > input[aria-label='Toggle']",
    );

    const isSwitchChecked = await toggleTestnetSwitch.isChecked().catch(() => false);
    if (!isSwitchChecked && args.mode === "on") {
        await toggleTestnetButton.click();
    }

    if (isSwitchChecked && args.mode === "off") {
        await toggleTestnetButton.click();
        const headerBackButton = page.getByTestId("header--back");
        await headerBackButton.click();

        const settingsCloseButton = page.getByTestId(settingsSelectors.closeMenuButton);
        await settingsCloseButton.click();
        return;
    }

    if (args.mode === "on" && args.chain === "Solana") {
        const { network } = args;
        const solanaTestnetButton = developerSettingsMenu.locator(
            "button:has-text('Solana'):not([data-testid^='fungible-token-row'])",
        );
        await solanaTestnetButton.click();

        const networkButton = page.locator(`button:has-text("${network}")`);
        await networkButton.click();

        await expect(solanaTestnetButton.last()).toContainText(network);
    }

    if (args.mode === "on" && args.chain === "Ethereum") {
        const { network } = args;
        const ethereumTestnetButton = developerSettingsMenu.locator(
            "button:has-text('Ethereum'):not([data-testid^='fungible-token-row'])",
        );
        const isEthereumButtonVisible = await ethereumTestnetButton.isVisible().catch(() => false);

        if (!isEthereumButtonVisible) {
            throw new Error(
                [
                    "Ethereum testnet option is not available. Please ensure Ethereum is enabled in optional chains.",
                    "\n To enable Ethereum, use the 'toggleOptionalChain'",
                    "\n For example: toggleOptionalChain({ page: page, toggleMode: 'on', supportedChains: ['Ethereum'] })",
                    "\n Note: To persist this change, you should enable Ethereum at after the onboarding process in your setup file.",
                ].join(" "),
            );
        }

        await ethereumTestnetButton.click();
        const networkButton = page.locator(`button:has-text("${network}")`);
        await networkButton.click();
        await expect(ethereumTestnetButton).toContainText(network);
    }

    const headerBackButton = page.getByTestId("header--back");
    await headerBackButton.click();

    // This is a hack to ensure that the "headerBackButton" is clicked.
    // In slowMo mode, we wouldn't need this. In normal mode, there is a race condition
    // happening that prevents the "headerBackButton" from being clicked.
    let isHeaderBackButtonVisible = await headerBackButton.isVisible().catch(() => false);
    while (isHeaderBackButtonVisible) {
        isHeaderBackButtonVisible = await headerBackButton.isVisible().catch(() => false);
        if (!isHeaderBackButtonVisible) break;
        await headerBackButton.click();
        await sleep(300);
    }

    const settingsCloseButton = page.getByTestId(settingsSelectors.closeMenuButton);
    await settingsCloseButton.click();
}
