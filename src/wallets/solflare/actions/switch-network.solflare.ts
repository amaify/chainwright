import type { Page } from "@playwright/test";
import { navigationMenuSelectors, settingsMenuSelectors } from "../selectors/homepage-selectors.solflare";
import type { SwitchNetwork } from "../types";
import { openSettings } from "./open-settings.solflare";

export async function switchNetwork(page: Page, network: SwitchNetwork) {
    await openSettings(page);

    const networkSettings = page.getByTestId("li-settings-network");
    const networkButton = networkSettings.getByRole("combobox");
    const networkButtonTextContent = await networkButton.locator(" > p").textContent();

    if (networkButtonTextContent !== network) {
        await networkButton.click();
        const selectNetworkContainer = page.getByTestId(settingsMenuSelectors.selectNetwork);
        const networkOption = selectNetworkContainer.getByRole("option", { name: network, exact: true });
        await networkOption.click();

        if (network === "Devnet" || network === "Testnet") {
            const confirmModal = page.getByTestId(settingsMenuSelectors.confirmModal);
            const confirmButton = confirmModal.getByTestId(settingsMenuSelectors.confifmButton);
            await confirmButton.click();
        }
    } else {
        console.info(`Network is already set to ${network}`);
    }

    // Go back to the portfolio page
    await page.getByTestId(navigationMenuSelectors.portfolioButton).click();
}
