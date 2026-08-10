import { expect, type Page } from "@playwright/test";
import { settingsSelectors } from "../selectors/homepage-selectors.metamask";
import type { AddCustomNetwork } from "../types";
import { openSettings } from "./open-settings.metamask";

interface AddCustomNetworkArgs extends AddCustomNetwork {
    page: Page;
}

export async function addCustomNetwork({ page, chainId, currencySymbol, networkName, rpcUrl }: AddCustomNetworkArgs) {
    await openSettings(page);
    const networksButton = page.getByTestId(settingsSelectors.networksButton);
    await networksButton.click();

    const networksDialog = page.getByTestId(settingsSelectors.networksPageList);
    await expect(networksDialog).toContainText(/networks/i);

    const addCustomNetworkButton = page.getByRole("button", { name: /add a custom network/i });
    await addCustomNetworkButton.click();

    // await expect(page).toContainText(/Add a custom network/i);

    const networkNameInput = page.getByTestId("network-form-network-name");
    const addRpcUrlDropdown = page.getByTestId("test-add-rpc-drop-down");

    const networkChainId = page.getByTestId("network-form-chain-id");
    const currencySymbolInput = page.getByTestId("network-form-ticker-input");

    await networkNameInput.fill(networkName);
    await addRpcUrlDropdown.click();

    const rpcTooltipUrl = page.getByRole("tooltip");

    const addRpcUrlButton = rpcTooltipUrl.locator("div:has(> button:has-text('Add RPC URL'))");
    await addRpcUrlButton.click();
    // await expect(networksDialog).toContainText(/Add RPC URL/i);

    const addRpcUrlInput = page.getByTestId("rpc-url-input-test");
    const addUrlButton = page.getByRole("button", { name: /Add URL/i });
    await addRpcUrlInput.fill(rpcUrl);
    await addUrlButton.click();

    // await expect(networksDialog).toContainText(/Add a custom network/i);

    const rpcError = page.getByTestId("network-form-chain-id-error");
    const isRPCErrorVisible = await rpcError.isVisible().catch(() => false);

    if (isRPCErrorVisible) {
        const errorText = await rpcError.textContent();
        throw Error(`RPC error: ${errorText}`);
    }

    await networkChainId.fill(`${chainId}`);
    await currencySymbolInput.fill(currencySymbol);

    const saveButton = page.getByRole("button", { name: /save/i });
    await expect(saveButton).toBeEnabled();
    await saveButton.click();

    const headerBackButton = page.getByTestId(settingsSelectors.headerBackButton);
    await headerBackButton.click();
}
