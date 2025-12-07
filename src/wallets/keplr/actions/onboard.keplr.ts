import type { Page } from "@playwright/test";
import picocolors from "picocolors";
import type { OnboardingArgs } from "../types";
import { addWalletViaPrivateKey } from "../utils";

type Onboard = OnboardingArgs & { page: Page };

export default async function onboard({ page, privateKey, walletName, chains }: Onboard) {
    console.info(picocolors.yellowBright(`\n Keplr onboarding started...`));

    await addWalletViaPrivateKey({ page, privateKey, walletName, chains, mode: "onboard" });

    console.info(picocolors.greenBright("✨ Keplr onboarding completed successfully"));
}
