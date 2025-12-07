import type { Page } from "@playwright/test";
import { KeplrProfile } from "../keplr-profile";
import type { OnboardingArgs } from "../types";
import { addWalletViaPrivateKey } from "../utils";

type AddAccount = OnboardingArgs & { page: Page };

export async function addAccount({ page, privateKey, chains, walletName }: AddAccount) {
    const walletProfile = new KeplrProfile();
    const onboardingUrl = await walletProfile.onboardingUrl();
    const indexUrl = await walletProfile.indexUrl();

    await page.goto(onboardingUrl, { waitUntil: "load" });

    await addWalletViaPrivateKey({ page: page, privateKey, walletName, chains, mode: "add-account" });

    await page.goto(indexUrl, { waitUntil: "load" });
}
