import { styleText } from "node:util";
import { expect, type Page } from "@playwright/test";
import { sleep } from "@/utils/sleep";
import { getWalletPasswordFromCache } from "@/utils/wallets/get-wallet-password-from-cache";
import { PhantomProfile } from "../phantom-profile";
import { onboardingSelectors } from "../selectors/onboard-selectors.phantom";
import type { OnboardingArgs } from "../types";
import { autoClosePhantomNotification } from "../utils";
import { addAccount } from "./add-account.phantom";
import { renameAccount } from "./rename-account.phantom";
import { switchAccount } from "./switch-account.phantom";
import { switchNetwork } from "./switch-network.phantom";

type Onboarding = OnboardingArgs & { page: Page };

type TargetInfo = {
    targetId: string;
    type: "page";
    title: "Phantom Wallet";
    url: string;
    attached: boolean;
    canAccessOpener: boolean;
    browserContextId: string;
};

export default async function onboard({ page, additionalAccounts, ...args }: Onboarding) {
    console.info(styleText("yellowBright", `\n Phantom onboarding started...`, { validateStream: false }));

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

        const createUserNameTextBox = page.getByRole("textbox", { name: "Username @ Clear", exact: true });
        await createUserNameTextBox
            .waitFor({ state: "attached", timeout: 5_000 })
            .then(async () => {
                const continuButton = page.getByRole("button", { name: "Continue", exact: true });
                await continuButton.click();
            })
            .catch(() => void 0);

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

        const getStartedButton = page.locator(onboardingSelectors.getStartedButton).last();
        await getStartedButton.click();
    }

    const newPage = await page.context().newPage();
    const indexUrl = await new PhantomProfile().indexUrl();
    await newPage.goto(indexUrl);

    // Look for the side panel that opens up and close it.
    const pageContext = page.context();
    const cdp = await pageContext.browser()?.newBrowserCDPSession();
    let sidePanelTargetInfo: TargetInfo | undefined;
    await expect
        .poll(
            async () => {
                if (cdp) {
                    const { targetInfos } = await cdp.send("Target.getTargets");
                    const sidePanelPopupTarget = targetInfos.filter((target) => target.title === "Phantom Wallet");
                    const _isSidePanelVisible = sidePanelPopupTarget.find(
                        (target) => !target.attached && target.url === indexUrl,
                    );
                    sidePanelTargetInfo = _isSidePanelVisible as TargetInfo;
                    return !!_isSidePanelVisible;
                }
            },
            {
                timeout: 20_000,
            },
        )
        .toBe(true);

    // Close the sidepanel page
    if (sidePanelTargetInfo) {
        await cdp?.send("Target.closeTarget", { targetId: sidePanelTargetInfo.targetId });
    }

    const initialAccountName = await newPage.getByTestId("home-header-account-name").textContent();

    if (!initialAccountName) {
        throw new Error("Cannot find initial account name");
    }

    const shouldRename = args.mode === "create" || args.mode === "recovery phrase";
    if (shouldRename) {
        const { accountName } = args;
        await renameAccount({ page: newPage, newAccountName: accountName, currentAccountName: initialAccountName });
    }

    if (additionalAccounts && additionalAccounts.length > 0) {
        const autoCloseController = new AbortController();

        autoClosePhantomNotification(newPage, autoCloseController.signal).catch((error) => console.error({ error }));

        for (const { accountName, chain, privateKey } of additionalAccounts) {
            await addAccount({ page: newPage, privateKey, accountName, chain });
            autoCloseController.abort();
        }

        await switchAccount(newPage, args.accountName);
    }

    if (args.toggleNetworkMode) {
        await switchNetwork({ page: newPage, ...args.toggleNetworkMode });
    }

    console.info(styleText("greenBright", "✨ Phantom onboarding completed successfully", { validateStream: false }));
}
