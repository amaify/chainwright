import { expect, type Page } from "@playwright/test";
import picocolors from "picocolors";
import { sleep } from "@/utils/sleep";
import waitForStablePage from "@/utils/wait-for-stable-page";
import { getWalletPasswordFromCache } from "@/utils/wallets/get-wallet-password-from-cache";
import { IS_VISIBLE_TIMEOUT } from "@/wallets/utils/constants";
import { PetraProfile } from "../petra-profile";
import { homepageSelectors } from "../selectors/homepage-selectors.petra";
import { onboardSelectors } from "../selectors/onboard-selectors.petra";
import type { OnboardingArgs } from "../types";
import { addAccount } from "./add-account.petra";
import { renameAccount } from "./rename-account.petra";
import { switchAccount } from "./switch-account.petra";

type Onboard = OnboardingArgs & {
    page: Page;
};

export default async function onboard({ page, ...args }: Onboard) {
    console.info(picocolors.yellowBright(`\n Petra onboarding started...`));

    const petraProfile = new PetraProfile();
    const PASSWORD = await getWalletPasswordFromCache("petra");

    const createAccountButton = page.locator(onboardSelectors.createWalletButton);
    const importWalletButton = page.locator(onboardSelectors.importWalletButton);
    const createNewPasswordInput = page.locator(onboardSelectors.createNewPasswordInput);
    const confirmNewPasswordInput = page.locator(onboardSelectors.confirmNewPasswordInput);
    const confirmPasswordCheckbox = page.locator(onboardSelectors.confirmPasswordCheckbox);
    const continueButton = page.locator(onboardSelectors.continueButton);
    const getStartedButton = page.locator(onboardSelectors.getStartedButton);
    const onboardingCompleteText = page.locator(onboardSelectors.onboardingCompleteText);

    if (args.mode === "create") {
        const createSeedPhraseButton = page.locator(onboardSelectors.createSeedPhraseButton);
        await createAccountButton.click();
        await createSeedPhraseButton.click();

        await createNewPasswordInput.fill(PASSWORD);
        await confirmNewPasswordInput.fill(PASSWORD);
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

    if (args.mode === "importPrivateKey") {
        const { privateKey } = args;
        const importPrivateKeyButton = page.locator(onboardSelectors.importUsingPrivateKeyButton);
        const privateKeyInput = page.locator(onboardSelectors.privateKeyInput);
        const importButton = page.locator(onboardSelectors.importButton);

        await importWalletButton.click();
        await importPrivateKeyButton.click();
        await privateKeyInput.fill(privateKey);

        await importButton.click();
        await createNewPasswordInput.fill(PASSWORD);
        await confirmNewPasswordInput.fill(PASSWORD);
        await confirmPasswordCheckbox.click();

        await continueButton.click();
        await getStartedButton.click();

        await expect(onboardingCompleteText).toBeVisible();
        await page.goto(await petraProfile.indexUrl());

        await waitForStablePage(page);

        await expect(page.locator(homepageSelectors.depositButton)).toBeVisible({ timeout: IS_VISIBLE_TIMEOUT });
        await expect(page.locator(homepageSelectors.sendButton)).toBeVisible({ timeout: IS_VISIBLE_TIMEOUT });
    }

    if (args.mode === "importMnemonic") {
        const { secretRecoveryPhrase } = args;
        const importMnemonicPhraseButton = page.locator(onboardSelectors.importUsingMnemonicButton);

        await importWalletButton.click();
        await importMnemonicPhraseButton.click();

        for (const [index, phrase] of secretRecoveryPhrase.split(" ").entries()) {
            const phraseInput = page.locator(
                `input[name="mnemonic-${String.fromCharCode("a".charCodeAt(0) + index)}"]`,
            );
            await phraseInput.fill(phrase);
        }

        await continueButton.click();
        await createNewPasswordInput.fill(PASSWORD);
        await confirmNewPasswordInput.fill(PASSWORD);
        await confirmPasswordCheckbox.click();

        await continueButton.click();
        await getStartedButton.click();
        await expect(onboardingCompleteText).toBeVisible();
        await page.goto(await petraProfile.indexUrl());

        await expect(page.locator(homepageSelectors.depositButton)).toBeVisible({ timeout: IS_VISIBLE_TIMEOUT });
        await expect(page.locator(homepageSelectors.sendButton)).toBeVisible({ timeout: IS_VISIBLE_TIMEOUT });
    }

    await renameAccount({ page, newAccountName: args.accountName });

    if (args.addWallet && args.addWallet.length > 0) {
        for (const { ...addAccountArgs } of args.addWallet) {
            await addAccount({ page, ...addAccountArgs });
        }

        await switchAccount(page, args.accountName);
    }

    await sleep(3_000);
    console.info(picocolors.greenBright("✨ Petra onboarding completed successfully"));
}
