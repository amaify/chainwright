import { expect, type Page } from "@playwright/test";
import picocolors from "picocolors";
import { sleep } from "@/utils/sleep";
import waitForStablePage from "@/utils/wait-for-stable-page";
import { KeplrProfile } from "../keplr-profile";
import { homepageSelectors } from "../selectors/homepage-selectors.keplr";
import { onboardingSelectors } from "../selectors/onboard-selectors.keplr";
import type { OnboardingArgs } from "../types";
import { addWalletViaPrivateKey } from "../utils";
import { switchAccount } from "./switch-account.keplr";

type Onboard = { onboard: OnboardingArgs } & { page: Page };

export default async function onboard({ page, onboard }: Onboard) {
    console.info(picocolors.yellowBright(`\n Keplr onboarding started...`));

    const walletProfile = new KeplrProfile();

    let count = 0;
    const accountsLength = onboard.length;

    let isStarted = false;
    const checkIsStarted = () => isStarted;

    for (const { privateKey, walletName, chains } of onboard) {
        const hasStarted = checkIsStarted();
        if (hasStarted) await page.goto(await walletProfile.onboardingUrl());

        await addWalletViaPrivateKey({
            page,
            privateKey,
            walletName,
            chains,
            mode: hasStarted ? "add-account-multiple" : "onboard",
        });
        count++;
        isStarted = true;
    }

    if (count === accountsLength) {
        await page.goto(await walletProfile.indexUrl());
        await waitForStablePage(page);

        const openMenuButton = page.locator(homepageSelectors.openSidebarMenuButton);
        await expect(openMenuButton).toBeVisible({ timeout: 30_000 });

        const currentAccountName = onboard.at(-1)?.walletName;
        const accountToSwitchTo = onboard[0]?.walletName;

        if (currentAccountName && accountToSwitchTo) {
            await switchAccount({ page, currentAccountName, accountToSwitchTo });
        }
    }

    console.info(picocolors.greenBright("✨ Keplr onboarding completed successfully"));
}
