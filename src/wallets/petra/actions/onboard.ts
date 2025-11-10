import { expect, type Page } from "@playwright/test";
import picocolors from "picocolors";
import { sleep } from "@/utils/sleep";
import waitForStablePage from "@/utils/wait-for-stable-page";
import { IS_VISIBLE_TIMEOUT } from "@/wallets/utils/constants";
import { PetraProfile } from "../petra-profile";
import { homepageSelectors } from "../selectors/homepage-selectors";
import { onboardSelectors } from "../selectors/onboard-selectors";
import type { OnboardingArgs } from "../types";

type Onboard = OnboardingArgs & {
    page: Page;
};

export default async function onboard({ page, mode, password, ...args }: Onboard) {
    console.info(picocolors.yellowBright(`\n Petra onboarding started...`));

    const petraProfile = new PetraProfile();

    const createAccountButton = page.locator(onboardSelectors.createWalletButton);
    const importWalletButton = page.locator(onboardSelectors.importWalletButton);
    const createNewPasswordInput = page.locator(onboardSelectors.createNewPasswordInput);
    const confirmNewPasswordInput = page.locator(onboardSelectors.confirmNewPasswordInput);
    const confirmPasswordCheckbox = page.locator(onboardSelectors.confirmPasswordCheckbox);
    const continueButton = page.locator(onboardSelectors.continueButton);
    const getStartedButton = page.locator(onboardSelectors.getStartedButton);
    const onboardingCompleteText = page.locator(onboardSelectors.onboardingCompleteText);

    if (mode === "create") {
        const createSeedPhraseButton = page.locator(onboardSelectors.createSeedPhraseButton);
        await createAccountButton.click();
        await createSeedPhraseButton.click();

        await createNewPasswordInput.fill(password);
        await confirmNewPasswordInput.fill(password);
        await confirmPasswordCheckbox.click();
        await continueButton.click();

        const skipCopyRecoveryPhraseButton = page.locator(onboardSelectors.skipCopyRecoveryPhraseButton);
        await skipCopyRecoveryPhraseButton.click();

        await getStartedButton.click();
        await expect(onboardingCompleteText).toBeVisible();
        await page.goto(await petraProfile.indexUrl());

        await expect(page.locator(homepageSelectors.depositButton)).toBeVisible({ timeout: IS_VISIBLE_TIMEOUT });
        await expect(page.locator(homepageSelectors.sendButton)).toBeVisible({ timeout: IS_VISIBLE_TIMEOUT });
    }

    if (mode === "importPrivateKey") {
        const privateKey = "privateKey" in args ? args.privateKey : "";
        const importPrivateKeyButton = page.locator(onboardSelectors.importUsingPrivateKeyButton);
        const privateKeyInput = page.locator(onboardSelectors.privateKeyInput);
        const importButton = page.locator(onboardSelectors.importButton);

        await importWalletButton.click();
        await importPrivateKeyButton.click();
        await privateKeyInput.fill(privateKey);

        await importButton.click();
        await createNewPasswordInput.fill(password);
        await confirmNewPasswordInput.fill(password);
        await confirmPasswordCheckbox.click();

        await continueButton.click();
        await getStartedButton.click();

        await expect(onboardingCompleteText).toBeVisible();
        await page.goto(await petraProfile.indexUrl());

        await waitForStablePage(page);

        await expect(page.locator(homepageSelectors.depositButton)).toBeVisible({ timeout: IS_VISIBLE_TIMEOUT });
        await expect(page.locator(homepageSelectors.sendButton)).toBeVisible({ timeout: IS_VISIBLE_TIMEOUT });
    }

    if (mode === "importMnemonic") {
        const mnemonicPhrase = "secretRecoveryPhrase" in args ? args.secretRecoveryPhrase.split(" ") : [];
        const importMnemonicPhraseButton = page.locator(onboardSelectors.importUsingMnemonicButton);

        await importWalletButton.click();
        await importMnemonicPhraseButton.click();

        for (const [index, phrase] of mnemonicPhrase.entries()) {
            const phraseInput = page.locator(
                `input[name="mnemonic-${String.fromCharCode("a".charCodeAt(0) + index)}"]`,
            );
            await phraseInput.fill(phrase);
        }

        await continueButton.click();
        await createNewPasswordInput.fill(password);
        await confirmNewPasswordInput.fill(password);
        await confirmPasswordCheckbox.click();

        await continueButton.click();
        await getStartedButton.click();
        await expect(onboardingCompleteText).toBeVisible();
        await page.goto(await petraProfile.indexUrl());

        await expect(page.locator(homepageSelectors.depositButton)).toBeVisible({ timeout: IS_VISIBLE_TIMEOUT });
        await expect(page.locator(homepageSelectors.sendButton)).toBeVisible({ timeout: IS_VISIBLE_TIMEOUT });
    }

    await sleep(8_000);
    console.info(picocolors.greenBright("✨ Petra onboarding completed successfully"));
}
