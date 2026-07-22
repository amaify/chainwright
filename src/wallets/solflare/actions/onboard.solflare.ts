import { styleText } from "node:util";
import type { Page } from "@playwright/test";
import { getWalletPasswordFromCache } from "@/utils/wallets/get-wallet-password-from-cache";
import { onboardingSelectors } from "../selectors/onboard-selectors.solflare";
import type { OnboardingArgs } from "../types";
import { autoCloseSolflareNotification } from "../utils";
import { addAccount } from "./add-account.solflare";
import { renameAccount } from "./rename-account.solflare";
import { switchNetwork } from "./switch-network.solflare";

type Onboard = OnboardingArgs & { page: Page };

export async function onboard({ page, recoveryPhrase, network, walletName, additionalAccounts }: Onboard) {
    console.info(styleText("yellowBright", `\n Solflare onboarding started...`, { validateStream: false }));

    const PASSWORD = await getWalletPasswordFromCache("solflare");

    const haveWalletButton = page.getByTestId(onboardingSelectors.alreadyHaveAWalletButton);
    await haveWalletButton.click();

    const _recoveryPhrase = recoveryPhrase.split(" ");
    for (const [index, phrase] of Object.entries(_recoveryPhrase)) {
        const recoveryPhraseInput = page.getByTestId(`${onboardingSelectors.recoveryPhraseInput}-${Number(index) + 1}`);
        await recoveryPhraseInput.fill(phrase);
    }

    const continueButton = page.getByTestId(onboardingSelectors.continueButton);
    await continueButton.click();

    const passwordInput = page.getByTestId(onboardingSelectors.passwordInput);
    const repeatPasswordInput = page.getByTestId(onboardingSelectors.repeatPasswordInput);
    await passwordInput.fill(PASSWORD);
    await repeatPasswordInput.fill(PASSWORD);
    await continueButton.click();

    const accountDetectionText = "Detecting your existing accounts. This process can take up to a minute.";
    const detectingAccount = page.locator("div", { hasText: accountDetectionText });
    await detectingAccount.waitFor({ state: "detached" });

    const quickSetupButton = page.getByTestId(onboardingSelectors.quickSetupButton);
    await quickSetupButton.click();

    const IAgreeButton = page.getByTestId(onboardingSelectors.IAgreeButton);
    await IAgreeButton.click();

    const autoCloseController = new AbortController();

    autoCloseSolflareNotification(page, autoCloseController.signal).catch((error) => console.error({ error }));

    if (walletName) {
        // "Main Wallet" is the default wallet name for the fist wallet in Solflare.
        await renameAccount({ page, currentAccountName: "Main Wallet", newAccountName: walletName });
    }

    // If network is provided, switch to it.
    if (network) await switchNetwork(page, network);

    if (additionalAccounts && additionalAccounts.length > 0) {
        for (const { privateKey, walletName } of additionalAccounts) {
            await addAccount({ page, privateKey, walletName });
        }
    }

    autoCloseController.abort();

    console.info(styleText("greenBright", "✨ Solflare onboarding completed successfully", { validateStream: false }));
}
