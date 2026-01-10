import fs from "node:fs";
import path from "node:path";
import { test as base, chromium, type Page } from "@playwright/test";
import createTempContextDirectory from "@/utils/create-temp-context-directory";
import getCacheDirectory from "@/utils/get-cache-directory";
import getPageFromContext from "@/utils/get-page-from-context";
import persistLocalStorage from "@/utils/persist-local-storage";
import { removeTempContextDir } from "@/utils/remove-temp-context-directory";
import waitForStablePage from "@/utils/wait-for-stable-page";
import { getWalletExtensionPathFromCache } from "@/utils/wallets/get-wallet-extension-path-from-cache";
import unlock from "./actions/unlock.metamask";
import { Metamask } from "./metamask";
import { MetamaskProfile } from "./metamask-profile";

export type MetamaskFixture = {
    contextPath: string;
    metamask: Metamask;
    metamaskPage: Page;
};

let _metamaskPage: Page;

export const metamaskFixture = (slowMo: number = 0, profileName?: string) => {
    return base.extend<MetamaskFixture>({
        contextPath: async ({ browserName }, use, testInfo) => {
            const tempWalletDataDir = await createTempContextDirectory(`${browserName}-${testInfo.testId}`);

            await use(tempWalletDataDir);

            const error = await removeTempContextDir(tempWalletDataDir);

            if (error) {
                console.error(error);
            }
        },
        context: async ({ context: currentContext, contextPath: tempWalletDataDir }, use) => {
            const wallet = new MetamaskProfile();

            const CACHE_DIR = getCacheDirectory(wallet.name);
            const extensionPath = await getWalletExtensionPathFromCache(wallet.name);
            const walletDataDir = path.resolve(CACHE_DIR, profileName ?? "wallet-data");

            if (!fs.existsSync(walletDataDir)) {
                throw new Error(`❌ Cache for MetaMask wallet data not found. Create it first`);
            }

            await fs.promises.cp(walletDataDir, tempWalletDataDir, { recursive: true, force: true });

            const browserArgs = [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`];
            if (process.env.HEADLESS) {
                browserArgs.push("--headless=new");

                if (slowMo > 0) {
                    console.warn("⚠️ Slow motion makes no sense in headless mode. It will be ignored!");
                }
            }

            const walletPageContext = await chromium.launchPersistentContext(tempWalletDataDir, {
                headless: false,
                args: [`--disable-extensions-except=${extensionPath}`],
                slowMo: process.env.HEADLESS ? 0 : slowMo,
            });

            const { cookies, origins } = await currentContext.storageState();
            if (cookies) await walletPageContext.addCookies(cookies);
            if (origins && origins.length > 0) persistLocalStorage(origins, walletPageContext);

            const indexUrl = await wallet.indexUrl();
            const homePage = walletPageContext.pages().find((page) => page.url().startsWith(indexUrl));
            _metamaskPage = homePage || (await getPageFromContext(walletPageContext, indexUrl));

            await waitForStablePage(_metamaskPage);

            for (const page of walletPageContext.pages()) {
                const url = page.url();
                if (url.includes("about:blank")) {
                    await page.close();
                }
            }

            await _metamaskPage.bringToFront();

            await unlock(_metamaskPage);
            // Close duplicate homepages.
            for (const page of walletPageContext.pages()) {
                const unlockButton = page.getByTestId("unlock-submit");
                const isUnlockButtonVisible = await unlockButton.isVisible().catch(() => false);

                if (isUnlockButtonVisible) {
                    await page.close();
                }
            }

            await use(walletPageContext);
            await walletPageContext.close();
        },
        metamaskPage: async ({ context: _ }, use) => {
            await use(_metamaskPage);
        },
        metamask: async ({ context: _ }, use) => {
            const metamaskInstance = new Metamask(_metamaskPage);
            await use(metamaskInstance);
        },
    });
};
