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
import { unlock } from "./actions/unlock.keplr";
import { Keplr } from "./keplr";
import { KeplrProfile } from "./keplr-profile";

export type KeplrFixture = {
    contextPath: string;
    keplr: Keplr;
    keplrPage: Page;
};

let _keplrPage: Page;

export const keplrFixture = (slowMo: number = 0, profileName?: string) => {
    return base.extend<KeplrFixture>({
        contextPath: async ({ browserName }, use, testInfo) => {
            const tempWalletDataDir = await createTempContextDirectory(`${browserName}-${testInfo.testId}`);

            await use(tempWalletDataDir);

            const error = await removeTempContextDir(tempWalletDataDir);

            if (error) {
                console.error(error);
            }
        },
        context: async ({ context: currentContext, contextPath: tempWalletDataDir }, use) => {
            const wallet = new KeplrProfile();

            const CACHE_DIR = getCacheDirectory(wallet.name);
            const extensionPath = await getWalletExtensionPathFromCache(wallet.name);
            const walletDataDir = path.resolve(CACHE_DIR, profileName ?? "wallet-data");

            if (!fs.existsSync(walletDataDir)) {
                throw new Error(`❌ Cache for Keplr wallet data not found. Create it first`);
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

            await walletPageContext.grantPermissions(["clipboard-read"]);

            const { cookies, origins } = await currentContext.storageState();
            if (cookies) await walletPageContext.addCookies(cookies);
            if (origins && origins.length > 0) persistLocalStorage(origins, walletPageContext);

            const indexUrl = await wallet.indexUrl();
            const homePage = walletPageContext.pages().find((page) => page.url().startsWith(indexUrl));
            _keplrPage = homePage || (await getPageFromContext(walletPageContext, indexUrl));

            await waitForStablePage(_keplrPage);

            for (const page of walletPageContext.pages()) {
                const url = page.url();
                if (url.includes("about:blank") || url.includes(wallet.onboardingPath)) {
                    await page.close();
                }
            }

            await _keplrPage.bringToFront();
            await unlock(_keplrPage);
            await use(walletPageContext);
            await walletPageContext.close();
        },
        keplrPage: async ({ context: _ }, use) => {
            await use(_keplrPage);
        },
        keplr: async ({ context: _ }, use) => {
            const keplrInstance = new Keplr(_keplrPage);
            await use(keplrInstance);
        },
    });
};
