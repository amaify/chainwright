import type { Page } from "@playwright/test";
import { homepageSelectors } from "../selectors/homepage-selectors";
import { onboardingSelectors } from "../selectors/onboard-selectors";
import type { AddAccountArgs } from "../types";
import { switchNetworkUtil } from "../utils";
import { renameAccount } from "./rename-account";

type AddAccount = AddAccountArgs & { page: Page };

export async function addAccount({ page, privateKey, accountName, network }: AddAccount) {
    const sidebarMenuButton = page.locator(homepageSelectors.openSidebarMenuButton);
    await sidebarMenuButton.click();

    const addWalletButton = page.locator(homepageSelectors.addWalletButton);
    await addWalletButton.click();

    await switchNetworkUtil(page, network, "section[role='dialog'] div[role='menu']");

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

    await renameAccount({ page, newAccountName: accountName });
}
