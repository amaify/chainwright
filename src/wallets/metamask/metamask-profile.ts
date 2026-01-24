import type { BrowserContext } from "@playwright/test";
import { getPopupPageFromContext } from "@/utils/wallets/get-popup-page-from-context";
import { getWalletExtensionIdFromCache } from "@/utils/wallets/get-wallet-extension-id-from-cache";

export class MetamaskProfile {
    readonly name = "metamask" as const;
    readonly onboardingPath = "/home.html#onboarding";

    async indexUrl() {
        const extensionId = await this.extensionId();
        return `chrome-extension://${extensionId}/home.html`;
    }

    async promptUrl() {
        const extensionId = await this.extensionId();
        return `chrome-extension://${extensionId}/notification.html`;
    }

    async extensionId() {
        return await getWalletExtensionIdFromCache(this.name);
    }

    async promptPage(context: BrowserContext) {
        const popupUrl = await this.promptUrl();
        const popupPage = await getPopupPageFromContext({
            context,
            path: popupUrl,
            locator: "div[data-testid='multichain-page']",
        });
        return popupPage;
    }
}
