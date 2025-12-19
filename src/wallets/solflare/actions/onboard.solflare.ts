import type { Page } from "@playwright/test";
import picocolors from "picocolors";
import { sleep } from "@/utils/sleep";
import { getWalletPasswordFromCache } from "@/utils/wallets/get-wallet-password-from-cache";
import { onboardingSelectors } from "../selectors/onboard-selectors.solflare";
import type { OnboardingArgs } from "../types";
import { addAccount } from "./add-account.solflare";
import { switchNetwork } from "./switch-network.solflare";

type Onboard = OnboardingArgs & { page: Page };

export async function onboard({ page, recoveryPhrase, network, addWallet }: Onboard) {
    console.info(picocolors.yellowBright(`\n Solflare onboarding started...`));

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

    // If network is provided, switch to it.
    if (network) await switchNetwork(page, network);

    await sleep(2_000);

    if (addWallet && addWallet?.length > 0) {
        for (const { privateKey, walletName } of addWallet) {
            await addAccount({ page, privateKey, walletName });
        }

        // Wait for 2 seconds to let the wallet sync
        await sleep(2_000);
    }

    console.info(picocolors.greenBright("✨ Solflare onboarding completed successfully"));
}
