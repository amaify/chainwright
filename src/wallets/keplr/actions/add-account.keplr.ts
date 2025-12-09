import type { Page } from "@playwright/test";
import { KeplrProfile } from "../keplr-profile";
import type { AddAccountArgs } from "../types";
import { addWalletViaPrivateKey } from "../utils";

type AddAccount = AddAccountArgs & { page: Page };

export async function addAccount({ page, privateKey, chains, walletName, mode }: AddAccount) {
    const walletProfile = new KeplrProfile();
    const onboardingUrl = await walletProfile.onboardingUrl();

    const settingsButton = page.getByRole("link", { name: "Settings", exact: true });
    await settingsButton.click();

    const activeAccount = page.locator("div[cursor='pointer']").first();
    await activeAccount.click();

    const addWalletButton = page.getByRole("button", { name: "Add Wallet", exact: true });
    await addWalletButton.click();

    const contextPages = page.context().pages();

    for (const contextPage of contextPages) {
        if (contextPage.url().includes(onboardingUrl)) {
            await contextPage.bringToFront();
            await addWalletViaPrivateKey({ page: contextPage, privateKey, walletName, chains, mode });
            break;
        }
    }

    const backButtonContainer = page.locator("div:has(div:has-text('Select Wallet'))").nth(-4);
    const backButton = backButtonContainer.locator("div:has(> div > svg)").first();
    await backButton.click();

    const homeButton = page.getByRole("link", { name: "Home", exact: true });
    await homeButton.click();
}
