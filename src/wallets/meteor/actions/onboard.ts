import type { Page } from "@playwright/test";
import { MeteorProfile } from "../meteor-profile";
import { onboardingSelectors } from "../selectors/onboard-selectors";
import type { OnboardingArgs } from "../types";
import { renameAccount } from "./rename-account";

type Onboard = OnboardingArgs & { page: Page };

export default async function onboard({ page, privateKey, network, password, accountName }: Onboard) {
    const meteorProfile = new MeteorProfile();
    const indexUrl = await meteorProfile.indexUrl();
    await page.goto(indexUrl);

    const switchNetworkButton = page.locator(onboardingSelectors.switchNetworkButton).last();
    await switchNetworkButton.click();

    const popoverMenuList = page.locator("section[role='dialog'] div[role='menu']");
    const networkButtonOption = popoverMenuList.locator(`> button:has-text('${network}')`);
    await networkButtonOption.click();

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

    const accountButton = page.locator("button:not([aria-label='Back'],[id^='menu-button']):has-text('Account')");
    await accountButton.click();

    const closeModalButton = page.locator("button:has-text('Close')").first();
    const isCloseModalButtonVisible = await closeModalButton.isVisible().catch(() => false);

    if (isCloseModalButtonVisible) {
        await closeModalButton.click();
    }

    const setPasswordButton = page.locator('button:has-text("Set Password")');
    await setPasswordButton.click();

    const passwordInput = page.locator("input[placeholder='Enter Password']");
    const confirmPasswordInput = page.locator("input[placeholder='Confirm Password']");
    const changePasswordButton = page.locator('button:has-text("Change Password")');

    await passwordInput.fill(password);
    await confirmPasswordInput.fill(password);
    await changePasswordButton.click();

    const finishButton = page.locator('button:has-text("Finish")');
    await finishButton.click();

    await renameAccount({ page, newAccountName: accountName });
}
