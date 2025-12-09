import type { Page } from "@playwright/test";
import { getWalletPasswordFromCache } from "@/utils/wallets/get-wallet-password-from-cache";
import { onboardingSelectors } from "./selectors/onboard-selectors.keplr";
import type { AddAccountArgs } from "./types";

type AddWalletViaPrivateKey = AddAccountArgs & {
    page: Page;
};

export async function addWalletViaPrivateKey({
    page,
    privateKey,
    walletName,
    chains,
    mode = "onboard",
}: AddWalletViaPrivateKey) {
    const PASSWORD = await getWalletPasswordFromCache("keplr");
    const importExistingWalletButton = page.locator(onboardingSelectors.importExistingWalletButton);
    await importExistingWalletButton.click();

    const usePrivateKeyButton = page.locator(onboardingSelectors.usePrivateKeyButton);
    await usePrivateKeyButton.click();

    const privateKeyTabButton = page.getByRole("button", { name: "Private key", exact: true });
    await privateKeyTabButton.click();

    const privateKeyInput = page.locator(onboardingSelectors.privateKeyInput);
    await privateKeyInput.fill(privateKey);

    const importButton = page.getByRole("button", { name: "Import", exact: true });
    await importButton.click();

    const walletNameInput = page.locator(onboardingSelectors.walletNameInput);
    await walletNameInput.fill(walletName);

    if (mode === "onboard") {
        const walletPasswordInput = page.locator(onboardingSelectors.walletPasswordInput);
        const confirmPasswordInput = page.locator(onboardingSelectors.confirmWalletPasswordInput);

        await walletPasswordInput.fill(PASSWORD);
        await confirmPasswordInput.fill(PASSWORD);
    }

    const nextButton = page.locator(onboardingSelectors.nextButton);
    await nextButton.click();

    const allNativeChains = page.locator("div:has-text('All Native Chains')").nth(-4);
    const cosmosHubChain = page.locator("div[cursor='pointer']:has-text('Cosmos Hub')");
    const allNativeChainsCheckbox = await allNativeChains.locator("input[type='checkbox']").getAttribute("checked");
    const cosmosHubChainCheckbox = await cosmosHubChain.locator("input[type='checkbox']").getAttribute("checked");

    // Uncheck "All Native Chains" and "Cosmos Hub"
    if (allNativeChainsCheckbox !== null) await allNativeChains.click();
    if (cosmosHubChainCheckbox !== null) await cosmosHubChain.click();

    const searchNetworkInput = page.locator(onboardingSelectors.searchNetworkInput);

    for (const chain of chains) {
        await searchNetworkInput.fill(chain);

        const chainsContainer = page.locator("div[class='simplebar-content']");
        const currentChain = chainsContainer.locator(`div[cursor='pointer']:has-text('${chain}')`).first();
        const isCurrentChainChecked = await currentChain.locator("input[type='checkbox']").getAttribute("checked");

        // If the current chain is not checked, check it.
        if (isCurrentChainChecked === null) {
            await currentChain.click();
        }
    }

    const saveButton = page.locator(onboardingSelectors.saveButton);
    await saveButton.scrollIntoViewIfNeeded();
    await saveButton.click();

    if (mode === "add-account-single") {
        const finishButton = page.locator(onboardingSelectors.finishButton);
        await finishButton.click();
    }
}
