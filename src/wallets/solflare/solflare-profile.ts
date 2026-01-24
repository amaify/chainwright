import type { BrowserContext } from "@playwright/test";
import { getPopupPageFromContext } from "@/utils/wallets/get-popup-page-from-context";
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

    async promptPage(context: BrowserContext) {
        const popupUrl = await this.promptUrl();
        const popupPage = await getPopupPageFromContext({
            context,
            path: popupUrl,
            locator: "div[data-testid='page-dapp-connect'], div[data-testid='page-tx-sign']",
        });
        return popupPage;
    }
}
