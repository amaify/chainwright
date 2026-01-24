import { expect, type Page } from "@playwright/test";
import picocolors from "picocolors";
import { sleep } from "@/utils/sleep";
import { getWalletPasswordFromCache } from "@/utils/wallets/get-wallet-password-from-cache";
import { MetamaskProfile } from "../metamask-profile";
import { homepageSelectors } from "../selectors/homepage-selectors.metamask";
import { onboardSelectors } from "../selectors/onboard-selectors.metamask";
import type { OnboardingArgs } from "../types";
import { switchAccount } from "./switch-account.metamask";
import { toggleShowTestnetNetwork } from "./toggle-show-testnet-network";

type Onboard = OnboardingArgs & {
    page: Page;
};

type TargetInfo = {
    targetId: string;
    type: "page";
    title: "MetaMask";
    url: string;
    attached: boolean;
    canAccessOpener: boolean;
    browserContextId: string;
};

export default async function onboard({ page, mainAccountName, ...args }: Onboard) {
    console.info(picocolors.yellowBright(`\n 🦊 MetaMask onboarding started...`));
    const PASSWORD = await getWalletPasswordFromCache("metamask");
    const walletProfile = new MetamaskProfile();

    const createWalletButton = page.getByTestId(onboardSelectors.createWalletButton);
    const importWalletButton = page.getByTestId(onboardSelectors.importWalletButton);
    const createNewPasswordInput = page.getByTestId(onboardSelectors.createNewPasswordInput);
    const confirmNewPasswordInput = page.getByTestId(onboardSelectors.confirmNewPasswordInput);
    const confirmPasswordCheckbox = page.getByTestId(onboardSelectors.confirmPasswordCheckbox);
    const createPasswordButton = page.getByTestId(onboardSelectors.createPasswordButton);
    const metamaskMetricsIAgreeButton = page.getByTestId(onboardSelectors.metamaskMetricsIAgreeButton);
    const onboardingDoneButton = page.getByTestId(onboardSelectors.onboardingDoneButton);

    if (args.mode === "create") {
        const useSecretRecoveryPhraseButton = page.getByTestId(onboardSelectors.useSecretRecoveryPhraseButton);
        await createWalletButton.click();
        await useSecretRecoveryPhraseButton.click();

        await createNewPasswordInput.fill(PASSWORD);
        await confirmNewPasswordInput.fill(PASSWORD);

        await confirmPasswordCheckbox.click();
        await createPasswordButton.click();

        const revealSecretRecoveryPhraseButton = page.getByTestId(onboardSelectors.revealSecretRecoveryPhraseButton);
        await revealSecretRecoveryPhraseButton.click();

        const recoveryPhraseRemindMeLaterButton = page.getByTestId(onboardSelectors.recoveryPhraseRemindMeLaterButton);
        await recoveryPhraseRemindMeLaterButton.click();

        await metamaskMetricsIAgreeButton.click();
    }

    if (args.mode === "import") {
        const { secretRecoveryPhrase } = args;
        const recoveryPhrase = secretRecoveryPhrase.split(" ");

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
        await createNewPasswordInput.fill(PASSWORD);

        await confirmNewPasswordInput.fill(PASSWORD);
        await confirmPasswordCheckbox.click();

        await createPasswordButton.click();
        await metamaskMetricsIAgreeButton.click();

        const walletReadyBox = page.getByTestId("wallet-ready");
        await expect(walletReadyBox).toContainText(/your wallet is ready/i);
    }

    await onboardingDoneButton.click();
    const extensionId = await walletProfile.extensionId();
    const sidepanelUrl = `chrome-extension://${extensionId}/sidepanel.html`;

    // Look for the side panel that opens up and close it.
    const pageContext = page.context();
    const cdp = await pageContext.browser()?.newBrowserCDPSession();
    let sidePanelTargetInfo: TargetInfo | undefined;
    await expect
        .poll(
            async () => {
                if (cdp) {
                    const { targetInfos } = await cdp.send("Target.getTargets");
                    const _isSidePanelVisible = targetInfos.find((target) => target.url === sidepanelUrl);
                    sidePanelTargetInfo = _isSidePanelVisible as TargetInfo;
                    return !!_isSidePanelVisible;
                }
            },
            {
                intervals: [1_000, 3_000, 5_000, 7_000, 10_000],
                timeout: 15_000,
            },
        )
        .toBe(true);

    // Close the sidepanel page
    if (sidePanelTargetInfo) {
        await cdp?.send("Target.closeTarget", { targetId: sidePanelTargetInfo.targetId });
    }

    await page.goto(await walletProfile.indexUrl());

    await expect(page.getByTestId(homepageSelectors.buyButton)).toBeVisible();
    await expect(page.getByTestId(homepageSelectors.swapButton)).toBeVisible();
    await expect(page.getByTestId(homepageSelectors.sendButton)).toBeVisible();
    await expect(page.getByTestId(homepageSelectors.receiveButton)).toBeVisible();

    await toggleShowTestnetNetwork({ page });
    if (mainAccountName) {
        await switchAccount({ page, accountName: mainAccountName });
    }

    await sleep(3_000);

    console.info(picocolors.greenBright("✨ MetaMask onboarding completed successfully"));
}
