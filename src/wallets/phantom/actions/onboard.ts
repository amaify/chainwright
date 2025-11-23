import type { Page } from "@playwright/test";
import picocolors from "picocolors";
import { sleep } from "@/utils/sleep";
import { PhantomProfile } from "../phantom-profile";
import { onboardingSelectors } from "../selectors/onboard-selectors";
import type { OnboardingArgs } from "../types";

type Onboarding = OnboardingArgs & { page: Page };

export default async function onboard({ page, ...args }: Onboarding) {
    console.info(picocolors.yellowBright(`\n Phantom onboarding started...`));

    if (args.mode === "create") {
        const createANewWalletButton = page.locator(onboardingSelectors.createNewWalletButton);
        await createANewWalletButton.click();

        const createSeedPhraseWalletButton = page.getByTestId(onboardingSelectors.createSeedPhraseWalletButton);
        await createSeedPhraseWalletButton.click();

        const passwordInput = page.getByTestId(onboardingSelectors.passwordInput);
        const confirmPasswordInput = page.getByTestId(onboardingSelectors.passwordConfirmInput);
        const termsCheckBox = page.getByTestId(onboardingSelectors.termsCheckBox);
        const continueButton = page.locator(onboardingSelectors.continueButton);

        await passwordInput.fill(args.password);
        await confirmPasswordInput.fill(args.password);
        await termsCheckBox.click();
        await continueButton.click();

        const loadingButton = continueButton.locator("> div > svg");
        await loadingButton.waitFor({ state: "detached", timeout: 30_000 });

        const recoveryPhraseSavedCheckbox = page.getByTestId(onboardingSelectors.recoveryPhraseSavedCheckbox);
        await recoveryPhraseSavedCheckbox.click();
        await continueButton.click();

        await sleep(1_000);

        await continueButton.click();

        const getStartedButton = page.locator(onboardingSelectors.getStartedButton).last();
        await getStartedButton.click();
    }

    if (args.mode === "recovery phrase") {
        const recoveryPhraseArg = args.secretRecoveryPhrase;
        const recoveryPhrases = recoveryPhraseArg.split(" ");

        const iAlreadyHaveAWalletButton = page.locator(onboardingSelectors.IAlreadyHaveAWalletButton);
        await iAlreadyHaveAWalletButton.click();

        const importViaRecoveryPhrase = page.locator(onboardingSelectors.importRecoveryPhraseButton);
        await importViaRecoveryPhrase.click();

        for (const [index, phrase] of Object.entries(recoveryPhrases)) {
            const recoveryPhraseInput = page.getByTestId(`${onboardingSelectors.recoveryPhraseInput}-${index}`);
            await recoveryPhraseInput.fill(phrase);
        }

        const importWalletButton = page.locator(onboardingSelectors.importWalletButton);
        await importWalletButton.click();

        const searchingForAccount = page.locator("p:has-text('Finding accounts with activity')");
        await searchingForAccount.waitFor({ state: "detached", timeout: 60_000 });

        const continueButton = page.locator(onboardingSelectors.continueButton);
        await continueButton.click();

        const passwordInput = page.getByTestId(onboardingSelectors.passwordInput);
        const confirmPasswordInput = page.getByTestId(onboardingSelectors.passwordConfirmInput);
        const termsCheckBox = page.getByTestId(onboardingSelectors.termsCheckBox);

        await passwordInput.fill(args.password);
        await confirmPasswordInput.fill(args.password);
        await termsCheckBox.click();

        await continueButton.click();
        const loadingButton = continueButton.locator("> div > svg");
        await loadingButton.waitFor({ state: "detached", timeout: 30_000 });

        const getStartedButton = page.locator(onboardingSelectors.getStartedButton).last();
        await getStartedButton.click();
    }

    if (args.mode === "private key") {
        const iAlreadyHaveAWalletButton = page.locator(onboardingSelectors.IAlreadyHaveAWalletButton);
        await iAlreadyHaveAWalletButton.click();

        const { privateKey, chain, password, accountName } = args;
        const importViaPrivateKey = page.locator(onboardingSelectors.importPrivateKeyButton);
        await importViaPrivateKey.click();

        const listBoxMenu = page.locator("span[id='button--listbox-input--1']");
        const listBoxMenuTitle = await listBoxMenu.textContent();

        const nameInput = page.locator("input[name='name']");
        const privateKeyInput = page.locator("textarea[name='privateKey']");

        if (listBoxMenuTitle !== chain) {
            await listBoxMenu.click();

            const menuList = page.locator("ul[id='listbox--listbox-input--1']");
            const menuListItem = menuList.locator(`li[data-label='${chain}']`);
            await menuListItem.click();
        }

        await nameInput.fill(accountName);
        await privateKeyInput.fill(privateKey);

        const importButton = page.locator("button:has-text('Import')");
        await importButton.click();

        const passwordInput = page.getByTestId(onboardingSelectors.passwordInput);
        const confirmPasswordInput = page.getByTestId(onboardingSelectors.passwordConfirmInput);
        const termsCheckBox = page.getByTestId(onboardingSelectors.termsCheckBox);

        await passwordInput.fill(password);
        await confirmPasswordInput.fill(password);
        await termsCheckBox.click();

        const continueButton = page.locator(onboardingSelectors.continueButton);
        await continueButton.click();

        const loadingButton = continueButton.locator("> div > svg");
        await loadingButton.waitFor({ state: "detached", timeout: 30_000 });

        await sleep(1_000);

        await continueButton.click();

        const getStartedButton = page.locator(onboardingSelectors.getStartedButton).last();
        await getStartedButton.click();
    }

    const newPage = await page.context().newPage();
    await newPage.goto(await new PhantomProfile().indexUrl());

    // wait for the wallet profile to finish saving
    await sleep(8_000);

    console.info(picocolors.greenBright("✨ Phantom onboarding completed successfully"));
}
