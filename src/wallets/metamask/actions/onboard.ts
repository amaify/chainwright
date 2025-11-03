import { expect } from "@playwright/test";
import type { Page } from "playwright-core";
import { onboardSelectors } from "../selectors/onboard-selectors";
import type { OnboardingArgs } from "../types";

interface Onboard extends OnboardingArgs {
    page: Page;
}

export default async function onboard({ page, mode, password, secretRecoveryPhrase }: Onboard) {
    console.info("[Onboarding....] Setting up MetaMask Profile One.....");

    const createWalletButton = page.getByTestId(onboardSelectors.createWalletButton);
    const importWalletButton = page.getByTestId(onboardSelectors.importWalletButton);
    const useSecretRecoveryPhraseButton = page.getByTestId(onboardSelectors.useSecretRecoveryPhraseButton);

    if (mode === "create") {
        await expect(createWalletButton).toBeVisible();
        await createWalletButton.click();

        await expect(useSecretRecoveryPhraseButton).toBeVisible();
        await useSecretRecoveryPhraseButton.click();

        const createNewPasswordInput = page.getByTestId(onboardSelectors.createNewPasswordInput);
        const confirmNewPasswordInput = page.getByTestId(onboardSelectors.confirmNewPasswordInput);
        const confirmPasswordCheckbox = page.getByTestId(onboardSelectors.confirmPasswordCheckbox);
        const createPasswordButton = page.getByTestId(onboardSelectors.createPasswordButton);

        await expect(createNewPasswordInput).toBeVisible();
        await createNewPasswordInput.fill(password);

        await expect(confirmNewPasswordInput).toBeVisible();
        await confirmNewPasswordInput.fill(password);

        await expect(confirmPasswordCheckbox).toBeVisible();
        await confirmPasswordCheckbox.click();

        await expect(createPasswordButton).toBeVisible();
        await createPasswordButton.click();

        return;
    }

    await expect(importWalletButton).toBeVisible();
    await importWalletButton.click();

    await expect(useSecretRecoveryPhraseButton).toBeVisible();
    await useSecretRecoveryPhraseButton.click();

    return "Onboarded successfully";
}
