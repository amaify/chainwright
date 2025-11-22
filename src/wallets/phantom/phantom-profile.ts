import { getWalletExtensionIdFromCache } from "@/utils/wallets/get-wallet-extension-id-from-cache";

export class PhantomProfile {
    readonly name = "phantom" as const;
    readonly onboardingPath = "/onboarding.html"; // Not implemented;

    async indexUrl() {
        const extensionId = await this.extensionId();
        return `chrome-extension://${extensionId}/popup.html`;
    }

    async promptUrl() {
        const extensionId = await this.extensionId();
        return `chrome-extension://${extensionId}/<Notification/prompt path>.html`;
    }

    async extensionId() {
        return await getWalletExtensionIdFromCache(this.name);
    }
}
