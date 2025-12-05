import { getWalletExtensionIdFromCache } from "@/utils/wallets/get-wallet-extension-id-from-cache";

export class KeplrProfile {
    readonly name = "keplr" as const;
    readonly onboardingPath = ""; // Not implemented;

    async indexUrl() {
        const extensionId = await this.extensionId();
        return `chrome-extension://${extensionId}/<home/index path>.html`;
    }

    async promptUrl() {
        const extensionId = await this.extensionId();
        return `chrome-extension://${extensionId}/<Notification/prompt path>.html`;
    }

    async extensionId() {
        return await getWalletExtensionIdFromCache(this.name);
    }
}
