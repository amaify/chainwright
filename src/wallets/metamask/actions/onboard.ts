import { expect, type Page } from "@playwright/test";
import picocolors from "picocolors";
import { sleep } from "@/utils/sleep";
import { homepageSelectors } from "../selectors/homepage-selectors";
import { onboardSelectors } from "../selectors/onboard-selectors";
import type { OnboardingArgs } from "../types";
import { toggleShowTestnetNetwork } from "./toggle-show-testnet-network";

type Onboard = OnboardingArgs & {
    page: Page;
};

export default async function onboard({ page, mode, password, ...args }: Onboard) {
    console.info(picocolors.yellowBright(`\n 🦊 MetaMask onboarding started...`));

    const createWalletButton = page.getByTestId(onboardSelectors.createWalletButton);
    const importWalletButton = page.getByTestId(onboardSelectors.importWalletButton);
    const createNewPasswordInput = page.getByTestId(onboardSelectors.createNewPasswordInput);
    const confirmNewPasswordInput = page.getByTestId(onboardSelectors.confirmNewPasswordInput);
    const confirmPasswordCheckbox = page.getByTestId(onboardSelectors.confirmPasswordCheckbox);
    const createPasswordButton = page.getByTestId(onboardSelectors.createPasswordButton);
    const metamaskMetricsIAgreeButton = page.getByTestId(onboardSelectors.metamaskMetricsIAgreeButton);
    const onboardingDoneButton = page.getByTestId(onboardSelectors.onboardingDoneButton);

    if (mode === "create") {
        const useSecretRecoveryPhraseButton = page.getByTestId(onboardSelectors.useSecretRecoveryPhraseButton);
        await createWalletButton.click();
        await useSecretRecoveryPhraseButton.click();

        await createNewPasswordInput.fill(password);
        await confirmNewPasswordInput.fill(password);

        await confirmPasswordCheckbox.click();
        await createPasswordButton.click();

        const revealSecretRecoveryPhraseButton = page.getByTestId(onboardSelectors.revealSecretRecoveryPhraseButton);
        await revealSecretRecoveryPhraseButton.click();

        const recoveryPhraseRemindMeLaterButton = page.getByTestId(onboardSelectors.recoveryPhraseRemindMeLaterButton);
        await recoveryPhraseRemindMeLaterButton.click();

        await metamaskMetricsIAgreeButton.click();
        await onboardingDoneButton.click();

        await expect(page.getByTestId(homepageSelectors.buyButton)).toBeVisible();
        await expect(page.getByTestId(homepageSelectors.swapButton)).toBeVisible();
        await expect(page.getByTestId(homepageSelectors.sendButton)).toBeVisible();
        await expect(page.getByTestId(homepageSelectors.receiveButton)).toBeVisible();
    }

    if (mode === "import") {
        const recoveryPhrase = "secretRecoveryPhrase" in args ? (args.secretRecoveryPhrase?.split(" ") ?? []) : [];
        const importUsingSecretRecoveryPhraseButton = page.getByTestId(
            onboardSelectors.importUsingSecretRecoveryPhraseButton,
        );

        await importWalletButton.click();
        await importUsingSecretRecoveryPhraseButton.click();

        const initialSecretRecoveryPhraseTextAreaInput = page.getByTestId(
            onboardSelectors.secretRecoveryPhraseTextAreaInput,
        );
        await initialSecretRecoveryPhraseTextAreaInput.fill(recoveryPhrase[0] as string);
        await initialSecretRecoveryPhraseTextAreaInput.press("Space");

        for (let i = 1; i < recoveryPhrase.length; i++) {
            const inputField = page.getByTestId(`import-srp__srp-word-${i}`);
            await inputField.fill(recoveryPhrase[i] as string);
            await inputField.press("Space");
        }

        const importWalletConfirmButton = page.getByTestId(onboardSelectors.importWalletConfirmButton);
        await importWalletConfirmButton.click();
        await createNewPasswordInput.fill(password);

        await confirmNewPasswordInput.fill(password);
        await confirmPasswordCheckbox.click();

        await createPasswordButton.click();
        await metamaskMetricsIAgreeButton.click();

        const walletReadyBox = page.getByTestId("wallet-ready");
        await expect(walletReadyBox).toContainText(/your wallet is ready/i);
        await onboardingDoneButton.click();

        await expect(page.getByTestId(homepageSelectors.buyButton)).toBeVisible();
        await expect(page.getByTestId(homepageSelectors.swapButton)).toBeVisible();
        await expect(page.getByTestId(homepageSelectors.sendButton)).toBeVisible();
        await expect(page.getByTestId(homepageSelectors.receiveButton)).toBeVisible();
    }

    await toggleShowTestnetNetwork({ page });

    await sleep(8_000);

    console.info(picocolors.greenBright("✨ MetaMask onboarding completed successfully"));
}
