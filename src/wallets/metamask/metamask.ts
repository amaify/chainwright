import type { Page } from "playwright-core";
import onboard from "./actions/onboard";
import type { OnboardingArgs } from "./types";

export class Metamask {
    private readonly name = "metamask";
    private readonly onboardingPath = "/home.html#onboarding";
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async onboard({ mode, password, secretRecoveryPhrase }: OnboardingArgs) {
        await onboard({ page: this.page, mode, password, secretRecoveryPhrase });
    }
}
