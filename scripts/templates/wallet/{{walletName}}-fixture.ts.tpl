import path from "path";
import { test as base, chromium, BrowserContext, Page } from "@playwright/test";
import fs from "fs-extra";
import { {{WalletName}}, {{WalletName}}Page } from "./{{walletName}}";
import { getExtensionPathFromCache } from "@/wallets/utils/get-extension-path-from-cache";
import { removeTempContextDir } from "@/wallets/utils/remove-temp-context-dir";
import { unlock } from "./actions/unlock";
import createContextDirectory from "@/wallets/utils/get-context-directory";
import getCacheDirectory from "@/wallets/utils/get-cache-directory";
import { getPageFromContext } from "@/wallets/utils/get-page-from-context";

export interface {{WalletName}}Fixtures {
  context: BrowserContext;
  extensionId: string;
  walletPage: {{WalletName}}Page;
  {{walletName}}Page: Page;
}

let _{{walletName}}Page: Page;

export const {{walletName}}BaseFixture = base.extend<{{WalletName}}Fixtures>({
  // Create a unique persistent directory per test
  context: async ({}, use, testInfo) => {
    const wallet = new {{WalletName}}();
    const CACHE_DIR_NAME = getCacheDirectory(wallet.name);
    const userCacheDir = path.join(`${CACHE_DIR_NAME}/user-data`);
    const contextPath = createContextDirectory(testInfo.testId, "{{walletName}}");

    if (!(await fs.pathExists(userCacheDir))) {
      throw new Error(`Cache for {{WalletName}}'s user data does not exist. Create it first!`);
    }

    await fs.copy(userCacheDir, contextPath);
    const {{walletName}}Path = await getExtensionPathFromCache("{{walletName}}");

    const context = await chromium.launchPersistentContext(contextPath, {
      headless: false,
      args: [`--disable-extensions-except=${{{walletName}}Path}`]
    });

    await context.grantPermissions(["clipboard-read"]);

    const indexUrl = await wallet.indexUrl();
    _{{walletName}}Page = await getPageFromContext(context, indexUrl);

    for (const page of context.pages()) {
      const url = page.url();
      if (url.includes(wallet.onboardingPath) || url.includes("about:blank")) {
        await page.close();
      }
    }

    // Close the _{{walletName}}Wallet page after unlocking
    await unlock(_{{walletName}}Page);

    await use(context);

    const error = await removeTempContextDir(contextPath);
    if (error) console.error(error);

    await context.close();
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  walletPage: async ({ context: _ }, use) => {
    const walletPage = new {{WalletName}}Page(_{{walletName}}Page);

    await use(walletPage);
  }
});
