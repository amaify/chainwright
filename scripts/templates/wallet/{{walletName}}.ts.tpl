import { Page } from "@playwright/test";
import { BaseWallet } from "@/wallets/core/base-wallet";
import { BaseWalletPage } from "@/wallets/core/base-wallet-page";
import { getPopupPageFromContext } from "@/wallets/utils/get-popup-page-from-context";
import { getExtensionIdFromCache } from "@/wallets/utils/get-extension-id-from-cache";
import { confirmTransaction } from "./actions/confirm-transaction";
import { cancelTransaction } from "./actions/cancel-transaction";
import { unlock } from "./actions/unlock";
import { connectToApp } from "./actions/connect-to-app";


export class {{WalletName}} extends BaseWallet {
  name = "{{walletName}}" as const;
  onboardingPath = "onboarding path here"

  async indexUrl(): Promise<string> {
     return `chrome-extension://${this.extensionId}/(path to the homepage).html`;
  };

  async promptUrl(): Promise<string> {
    const extensionId = await this.extensionId();
    return `chrome-extension://${extensionId}/(wallet's prompt path).html`;
  }

   async extensionId(): Promise<string> {
     return await getExtensionIdFromCache("{{walletName}}");
  }
}

export class {{WalletName}}Page extends BaseWalletPage {
  wallet: {{WalletName}};

  constructor(page: Page) {
    super(page);
    this.wallet = new {{WalletName}}()
  }

  async onboarding(): Promise<void> {
    console.error("not implemented");
  }

  async unlock(): Promise<void> {
    await unlock(this.page)
  }

  async connectToApp(): Promise<void> {
    const promptUrl = await this.wallet.promptUrl();
    const popupPage = await getPopupPageFromContext(this.page.context(), promptUrl);
    await connectToApp(popupPage)
  }

  async switchNetwork(networkName?: string): Promise<void> {
    console.info(networkName)
    console.error("not implemented");
  }

  async switchAccount(accountName: string): Promise<void> {
    console.info(accountName)
    console.error("not implemented");
  }

  async confirmTransaction(): Promise<void> {
    const promptUrl = await this.wallet.promptUrl();
    const popupPage = await getPopupPageFromContext(this.page.context(), promptUrl);
    await confirmTransaction(popupPage)
  }

  async cancelTransaction(): Promise<void> {
    const promptUrl = await this.wallet.promptUrl();
    const popupPage = await getPopupPageFromContext(this.page.context(), promptUrl);
    await cancelTransaction(popupPage)
  }

  async getAccountAddress(): Promise<string> {
    throw new Error("Not implemented");
  }
}
