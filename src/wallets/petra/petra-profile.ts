import { getWalletExtensionIdFromCache } from "@/utils/wallets/get-wallet-extension-id-from-cache";

export class PetraProfile {
    readonly name = "petra" as const;
    readonly onboardingPath = "/onboarding.html";

    async indexUrl() {
        const extensionId = await this.extensionId();
        return `chrome-extension://${extensionId}/index.html`;
    }

    async promptUrl() {
        const extensionId = await this.extensionId();
        return `chrome-extension://${extensionId}/prompt.html`;
    }

    async extensionId() {
        return await getWalletExtensionIdFromCache(this.name);
    }
}
