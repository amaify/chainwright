import fs from "node:fs";
import path from "node:path";
import { test as base, chromium, type Page } from "@playwright/test";
import createTempContextDirectory from "@/utils/create-temp-context-directory";
import getCacheDirectory from "@/utils/get-cache-directory";
import persistLocalStorage from "@/utils/persist-local-storage";
import { removeTempContextDir } from "@/utils/remove-temp-context-directory";
import { getWalletExtensionPathFromCache } from "@/utils/wallets/get-wallet-extension-path-from-cache";
import { unlock } from "./actions/unlock.phantom";
import { Phantom } from "./phantom";
import { PhantomProfile } from "./phantom-profile";
import { autoClosePhantomNotification, getPageFromContextPhantom } from "./utils";

export type PhantomFixture = {
    contextPath: string;
    autoCloseNotification: undefined;
    phantom: Phantom;
    phantomPage: Page;
};

let _phantomPage: Page;

export const phantomFixture = (slowMo: number = 0, profileName?: string) => {
    return base.extend<PhantomFixture>({
        contextPath: async ({ browserName }, use, testInfo) => {
            const tempWalletDataDir = await createTempContextDirectory(`${browserName}-${testInfo.testId}`);

            await use(tempWalletDataDir);
            const error = await removeTempContextDir(tempWalletDataDir);

            if (error) {
                console.error(error);
            }
        },
        context: async ({ context: currentContext, contextPath: tempWalletDataDir }, use) => {
            const wallet = new PhantomProfile();

            const CACHE_DIR = getCacheDirectory(wallet.name);
            const extensionPath = await getWalletExtensionPathFromCache(wallet.name);
            const walletDataDir = path.resolve(CACHE_DIR, profileName ?? "wallet-data");

            if (!fs.existsSync(walletDataDir)) {
                throw new Error(`❌ Cache for Phantom wallet data not found. Create it first`);
            }

            await fs.promises.cp(walletDataDir, tempWalletDataDir, { recursive: true, force: true });

            if (process.env.HEADLESS) {
                if (slowMo > 0) {
                    console.warn("⚠️ Slow motion makes no sense in headless mode. It will be ignored!");
                }
            }

            const walletPageContext = await chromium.launchPersistentContext(tempWalletDataDir, {
                headless: false,
                args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`],
                slowMo: process.env.HEADLESS ? 0 : slowMo,
            });

            await walletPageContext.grantPermissions(["clipboard-read"]);

            const { cookies, origins } = await currentContext.storageState();
            if (cookies) await walletPageContext.addCookies(cookies);
            if (origins && origins.length > 0) {
                await persistLocalStorage(origins, walletPageContext);
            }

            _phantomPage = await getPageFromContextPhantom(walletPageContext);

            for (const page of walletPageContext.pages()) {
                const url = page.url();
                if (url.includes("about:blank") || url.includes(wallet.onboardingPath)) {
                    await page.close();
                }
            }

            await _phantomPage.bringToFront();
            await unlock(_phantomPage);
            await use(walletPageContext);
            await walletPageContext.close();
        },
        phantomPage: async ({ context: _ }, use) => {
            await use(_phantomPage);
        },
        phantom: async ({ context: _ }, use) => {
            const phantomInstance = new Phantom(_phantomPage);
            await use(phantomInstance);
        },
        autoCloseNotification: [
            async ({ context: _ }, use) => {
                let cancelled = false;
                const isCancelled = () => cancelled;
                const runner = autoClosePhantomNotification(_phantomPage, isCancelled);

                await use(undefined);

                cancelled = true;
                await runner.catch((error) => {
                    console.error(`Auto close notification error: ${(error as Error).message}`);
                });
            },
            { auto: true },
        ],
    });
};
