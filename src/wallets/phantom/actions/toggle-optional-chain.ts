import type { Page } from "@playwright/test";
import { settingsSelectors } from "../selectors/homepage-selectors";
import type { ToggleOptionalChainArgs } from "../types";
import { openSettings } from "./open-settings";

type ToggleOptionalChain = ToggleOptionalChainArgs & { page: Page };

export async function toggleOptionalChain({ page, supportedChains, toggleMode = "off" }: ToggleOptionalChain) {
    await openSettings(page);

    const activeNetworkButton = page.locator("button[id='settings-item-active-networks']");
    await activeNetworkButton.click();
    const allOptionalButtons = await page.locator("button[id^='toggle']:not([disabled])").all();

    if (supportedChains.length === 0 && toggleMode === "onboard") {
        for (const option of allOptionalButtons) {
            await option.click();
        }

        const headerBackButton = page.getByTestId("header--back");
        await headerBackButton.click();

        const settingsCloseButton = page.getByTestId(settingsSelectors.closeMenuButton);
        await settingsCloseButton.click();

        return;
    }

    if (supportedChains.length === 0 && toggleMode !== "onboard") {
        throw Error("Supported chains array cannot be empty for toggle mode other than 'onboard'");
    }

    for (const chain of supportedChains) {
        const toggleButton = page.locator(`button[id='toggle-${chain.toLowerCase()}']`);
        const toggleSwitch = toggleButton.locator(
            `label[data-testid='toggle-${chain.toLowerCase()}-switch'] > input[aria-label='Toggle']`,
        );

        const isSwitchChecked = await toggleSwitch.isChecked().catch(() => false);

        if (toggleMode === "off" && isSwitchChecked) await toggleButton.click();
        if (toggleMode === "on" && !isSwitchChecked) await toggleButton.click();
    }

    const headerBackButton = page.getByTestId("header--back");
    await headerBackButton.click();

    const settingsCloseButton = page.getByTestId(settingsSelectors.closeMenuButton);
    await settingsCloseButton.click();
}
