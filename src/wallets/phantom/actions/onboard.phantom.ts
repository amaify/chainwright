import type { Page } from "@playwright/test";
import picocolors from "picocolors";
import { sleep } from "@/utils/sleep";
import { getWalletPasswordFromCache } from "@/utils/wallets/get-wallet-password-from-cache";
import { PhantomProfile } from "../phantom-profile";
import { onboardingSelectors } from "../selectors/onboard-selectors.phantom";
import type { OnboardingArgs } from "../types";
import { autoClosePhantomNotification } from "../utils";
import { addAccount } from "./add-account.phantom";
import { renameAccount } from "./rename-account.phantom";
import { switchAccount } from "./switch-account.phantom";

type Onboarding = OnboardingArgs & { page: Page };

export default async function onboard({ page, addWallet, ...args }: Onboarding) {
    console.info(picocolors.yellowBright(`\n Phantom onboarding started...`));

    const PASSWORD = await getWalletPasswordFromCache("phantom");

    if (args.mode === "create") {
        const createANewWalletButton = page.locator(onboardingSelectors.createNewWalletButton);
        await createANewWalletButton.click();

        const createSeedPhraseWalletButton = page.getByTestId(onboardingSelectors.createSeedPhraseWalletButton);
        await createSeedPhraseWalletButton.click();

        const passwordInput = page.getByTestId(onboardingSelectors.passwordInput);
        const confirmPasswordInput = page.getByTestId(onboardingSelectors.passwordConfirmInput);
        const termsCheckBox = page.getByTestId(onboardingSelectors.termsCheckBox);
        const continueButton = page.locator(onboardingSelectors.continueButton);

        await passwordInput.fill(PASSWORD);
        await confirmPasswordInput.fill(PASSWORD);
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

        await passwordInput.fill(PASSWORD);
        await confirmPasswordInput.fill(PASSWORD);
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

        const { privateKey, chain, accountName } = args;
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

        await passwordInput.fill(PASSWORD);
        await confirmPasswordInput.fill(PASSWORD);
        await termsCheckBox.click();

        const continueButton = page.locator(onboardingSelectors.continueButton);
        await continueButton.click();

        const loadingButton = continueButton.locator("> div > svg");
        await loadingButton.waitFor({ state: "detached", timeout: 30_000 });

        await continueButton.click();

        const getStartedButton = page.locator(onboardingSelectors.getStartedButton).last();
        await getStartedButton.click();
    }

    const newPage = await page.context().newPage();
    await newPage.goto(await new PhantomProfile().indexUrl());

    const shouldRename = args.mode === "create" || args.mode === "recovery phrase";
    if (shouldRename) {
        await renameAccount({ page: newPage, newAccountName: "Default", currentAccountName: "Account 1" });
    }

    if (addWallet && addWallet.length > 0) {
        let cancelled = false;
        const isCancelled = () => cancelled;

        const runner = autoClosePhantomNotification(newPage, isCancelled);
        for (const { accountName, chain, privateKey } of addWallet) {
            await addAccount({ page: newPage, privateKey, accountName, chain });
            cancelled = true;
        }

        runner.catch((error) => console.error({ error }));

        const _accountName = "accountName" in args ? args.accountName : "Default";
        await switchAccount(newPage, _accountName);
    }

    // // wait for the wallet profile to finish saving
    await sleep(2_000);

    console.info(picocolors.greenBright("✨ Phantom onboarding completed successfully"));
}
