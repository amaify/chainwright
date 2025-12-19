import type { Page } from "@playwright/test";
import picocolors from "picocolors";
import { sleep } from "@/utils/sleep";
import { getWalletPasswordFromCache } from "@/utils/wallets/get-wallet-password-from-cache";
import { MeteorProfile } from "../meteor-profile";
import { onboardingSelectors } from "../selectors/onboard-selectors.meteor";
import type { OnboardingArgs } from "../types";
import { addAccount } from "./add-account.meteor";
import { openSettings } from "./open-settings.meteor";
import { renameAccount } from "./rename-account.meteor";
import { switchAccount } from "./switch-account.meteor";
import { switchNetwork } from "./switch-network.meteor";

type Onboard = OnboardingArgs & { page: Page };

export default async function onboard({ page, privateKey, network, accountName, addWallet }: Onboard) {
    console.info(picocolors.yellowBright(`\n Meteor onboarding started...`));

    const PASSWORD = await getWalletPasswordFromCache("meteor");
    const meteorProfile = new MeteorProfile();
    const indexUrl = await meteorProfile.indexUrl();
    await page.goto(indexUrl);

    const switchNetworkButton = page.locator(onboardingSelectors.switchNetworkButton).last();
    const currentNetwork = await switchNetworkButton.textContent();
    const currentNetworkPassed = network.split("net")[0]?.toLowerCase() ?? "";

    if (!currentNetwork?.toLowerCase().includes(currentNetworkPassed)) {
        await switchNetworkButton.click();
        const popoverMenuList = page.locator("section[role='dialog'] div[role='menu']");
        const networkButtonOption = popoverMenuList.locator(`> button:has-text('${network}')`);
        await networkButtonOption.click();
    }

    const importExistingWalletButton = page.locator(onboardingSelectors.importExistingWalletButton);
    await importExistingWalletButton.click();

    const privateKeyButton = page.locator(onboardingSelectors.privateKeyButton);
    await privateKeyButton.click();

    const continueButton = page.locator('button:has-text("Continue")');
    await continueButton.scrollIntoViewIfNeeded();
    await continueButton.click();

    const privatekeyTextArea = page.locator("textarea:not([disabled])");
    await privatekeyTextArea.fill(privateKey);

    const findMyAccountButton = page.locator(onboardingSelectors.findMyAccountButton);
    await findMyAccountButton.click();
    const loadingButton = page.locator("button[type='submit'][data-loading]");
    await loadingButton.waitFor({ state: "detached", timeout: 25_000 });

    const warningToast = page.getByRole("status");
    const warningTitle = warningToast.locator("div[id='toast-1-title']:has-text('No Account Found')");
    const isWarningToastVisible = await warningTitle.isVisible().catch(() => false);

    if (isWarningToastVisible) {
        let maxRetries = 5;
        let isRetrySuccessful = false;

        while (maxRetries > 0) {
            console.info(`\n Retrying search for account. ${maxRetries} attempts left`);
            await sleep(15_000);
            await findMyAccountButton.click();
            await loadingButton.waitFor({ state: "detached", timeout: 20_000 });

            const importAccountContainer = page.locator("div:has-text('Import Your Account')").nth(-2);
            const importAccountButton = importAccountContainer.locator("button");
            const isImportAccountButtonVisible = await importAccountButton.isVisible().catch(() => false);

            if (isImportAccountButtonVisible) {
                isRetrySuccessful = true;
                break;
            }

            maxRetries -= 1;
        }

        if (!isRetrySuccessful) {
            throw Error(
                picocolors.redBright(
                    [
                        "No Account Found",
                        "Account associated with the private key not found. Please make sure you are trying to import an account on the correct network(Mainnet/Testnet).",
                    ].join("\n"),
                ),
            );
        }
    }

    const accountButton = page.locator("button:not([aria-label='Back'],[id^='menu-button']):has-text('Account')");
    await accountButton.click();

    const dialog = page.locator("section[role='dialog']");
    const closeModalButton = dialog.locator("button:has-text('Close')").first();
    const isCloseModalButtonVisible = await closeModalButton
        .isVisible()
        .then(() => true)
        .catch(() => false);

    if (isCloseModalButtonVisible) {
        await closeModalButton.click();
    }

    const setPasswordButton = page.locator('button:has-text("Set Password")');
    await setPasswordButton.click();

    const passwordInput = page.locator("input[placeholder='Enter Password']");
    const confirmPasswordInput = page.locator("input[placeholder='Confirm Password']");
    const changePasswordButton = page.locator('button:has-text("Change Password")');

    await passwordInput.fill(PASSWORD);
    await confirmPasswordInput.fill(PASSWORD);
    await changePasswordButton.click();

    const finishButton = page.locator('button:has-text("Finish")');
    await finishButton.click();

    await renameAccount({ page, newAccountName: accountName });

    if (addWallet && addWallet.length > 0) {
        for (const { privateKey, accountName, network } of addWallet) {
            await addAccount({ page, privateKey, accountName, network });
        }

        // check that the current network is the same as the initial network
        await openSettings(page);
        const switchNetworkButton = page.locator(onboardingSelectors.switchNetworkButton).last();
        await switchNetworkButton.scrollIntoViewIfNeeded();

        const currentNetwork = await switchNetworkButton.textContent();
        const currentNetworkPassed = network.split("net")[0]?.toLowerCase() ?? "";

        if (currentNetwork?.toLowerCase() !== currentNetworkPassed) {
            await switchNetwork(page, network);
        }

        await switchAccount(page, accountName);
    }

    await sleep(3_000);

    console.info(picocolors.greenBright("✨ Meteor onboarding completed successfully"));
}
