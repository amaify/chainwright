import { getWalletExtensionIdFromCache } from "@/utils/wallets/get-wallet-extension-id-from-cache";

export class MetamaskProfile {
    readonly name = "metamask" as const;
    readonly onboardingPath = "/home.html#onboarding";

    async indexUrl() {
        const extensionId = await this.extensionId();
        return `chrome-extension://${extensionId}/index.html`;
    }

    async promptUrl() {
        const extensionId = await this.extensionId();
        return `chrome-extension://${extensionId}/prompt.html`;
    }

    async extensionId() {
        return await getWalletExtensionIdFromCache("metamask");
    }
}
