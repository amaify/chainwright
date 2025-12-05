import { expect, type Page } from "@playwright/test";
import { homepageSelectors, settingsSelectors } from "../selectors/homepage-selectors.metamask";
import { type AddCustomNetwork, addCustomNetworkSchema } from "../types";

interface AddCustomNetworkArgs extends AddCustomNetwork {
    page: Page;
}

export async function addCustomNetwork({ page, ...args }: AddCustomNetworkArgs) {
    const { chainId, currencySymbol, networkName, rpcUrl } = addCustomNetworkSchema.parse(
        { ...args },
        {
            reportInput: true,
        },
    );

    const settingsButton = page.getByTestId(homepageSelectors.openSettingsButton);
    await settingsButton.click();

    const networksButton = page.getByTestId(settingsSelectors.networksButton);
    await networksButton.click();

    const netowrksDialog = page.getByRole("dialog");
    await expect(netowrksDialog).toContainText(/manage networks/i);

    const addCustomNetworkButton = page.getByRole("button", { name: /add a custom network/i });
    await addCustomNetworkButton.click();

    await expect(netowrksDialog).toContainText(/Add a custom network/i);

    const networkNameInput = page.getByTestId("network-form-network-name");
    const addRpcUrlDropdown = page.getByTestId("test-add-rpc-drop-down");

    const networkChainId = page.getByTestId("network-form-chain-id");
    const currencySymbolInput = page.getByTestId("network-form-ticker-input");

    await networkNameInput.fill(networkName);
    await addRpcUrlDropdown.click();

    const rpcTooltipUrl = page.getByRole("tooltip");

    const addRpcUrlButton = rpcTooltipUrl.locator("div:has(> button:has-text('Add RPC URL'))");
    await addRpcUrlButton.click();
    await expect(netowrksDialog).toContainText(/Add RPC URL/i);

    const addRpcUrlInput = page.getByTestId("rpc-url-input-test");
    const addUrlButton = page.getByRole("button", { name: /Add URL/i });
    await addRpcUrlInput.fill(rpcUrl);
    await addUrlButton.click();

    await expect(netowrksDialog).toContainText(/Add a custom network/i);

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
}
