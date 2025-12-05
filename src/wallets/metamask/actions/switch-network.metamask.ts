import { expect, type Page } from "@playwright/test";
import { homepageSelectors } from "../selectors/homepage-selectors.metamask";
import type { SwitchNetwork } from "../types";
import { toggleShowTestnetNetwork } from "./toggle-show-testnet-network";

type SwitchNetworkArgs = SwitchNetwork & {
    page: Page;
};

export async function switchNetwork({ page, networkType, chainName }: SwitchNetworkArgs) {
    const openChainSelector = page.getByTestId(homepageSelectors.openNetworkSelectorButton);
    await openChainSelector.click();

    const selectNetworkModalCloseButton = page.getByTestId("modal-header-close-button");

    if (networkType === "testnet" || networkType === "custom") {
        const customTabSelector = page.getByRole("tab", { name: "Custom" });
        await customTabSelector.click();

        const testnetTextSeparator = page.locator("p:has-text('Testnets')");
        const isTestnetSeparatorNotVisible = await testnetTextSeparator.isVisible().catch(() => false);

        if (!isTestnetSeparatorNotVisible) {
            await selectNetworkModalCloseButton.click();
            await toggleShowTestnetNetwork({ page: page });
            await openChainSelector.click();
            await customTabSelector.click();
        }

        const chainSelector = page.locator(`div div[data-testid='${chainName}']`);
        const chainSelectorText = await chainSelector.textContent();
        expect(chainSelectorText).toBe(chainName);

        await chainSelector.click();
        return;
    }

    const customTabSelector = page.getByRole("tab", { name: "Popular" });
    await customTabSelector.click();

    const chainSelector = page.locator(`div div[data-testid='${chainName}']`);
    const chainSelectorText = await chainSelector.textContent();
    expect(chainSelectorText).toBe(chainName);

    await chainSelector.click();
}
