import { getWalletExtensionIdFromCache } from "@/utils/wallets/get-wallet-extension-id-from-cache";

export class SolflareProfile {
    readonly name = "solflare" as const;
    readonly onboardingPath = "wallet.html#/onboard";

    async indexUrl() {
        const extensionId = await this.extensionId();
        return `chrome-extension://${extensionId}/wallet.html#/portfolio`;
    }

    async promptUrl() {
        const extensionId = await this.extensionId();
        return `chrome-extension://${extensionId}/confirm_popup.html`;
    }

    async extensionId() {
        return await getWalletExtensionIdFromCache(this.name);
    }
}
``;
