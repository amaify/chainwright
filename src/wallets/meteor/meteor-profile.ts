import { getWalletExtensionIdFromCache } from "@/utils/wallets/get-wallet-extension-id-from-cache";

export class MeteorProfile {
    readonly name = "meteor" as const;
    readonly onboardingPath = "ext_index_popup.html"; // Not implemented;

    async indexUrl() {
        const extensionId = await this.extensionId();
        return `chrome-extension://${extensionId}/ext_index_popup.html`;
    }

    async promptUrl() {
        const extensionId = await this.extensionId();
        return `chrome-extension://${extensionId}/<Notification/prompt path>.html`;
    }

    async extensionId() {
        return await getWalletExtensionIdFromCache(this.name);
    }
}
