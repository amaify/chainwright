import { getWalletExtensionIdFromCache } from "@/utils/wallets/get-wallet-extension-id-from-cache";

export class KeplrProfile {
    readonly name = "keplr" as const;
    readonly onboardingPath = "register.html";

    async indexUrl() {
        const extensionId = await this.extensionId();
        return `chrome-extension://${extensionId}/sidePanel.html`;
    }

    async onboardingUrl() {
        const extensionId = await this.extensionId();
        return `chrome-extension://${extensionId}/${this.onboardingPath}`;
    }

    async promptUrl() {
        const extensionId = await this.extensionId();
        return `chrome-extension://${extensionId}/popup.html`;
    }

    async extensionId() {
        return await getWalletExtensionIdFromCache(this.name);
    }
}
