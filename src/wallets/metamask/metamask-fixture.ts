import fs from "node:fs";
import path from "node:path";
import { type BrowserContext, test as base, chromium, type Page } from "@playwright/test";
import createTempContextDirectory from "@/utils/create-temp-context-directory";
import getCacheDirectory from "@/utils/get-cache-directory";
import getPageFromContext from "@/utils/get-page-from-context";
import persistLocalStorage from "@/utils/persist-local-storage";
import { removeTempContextDir } from "@/utils/remove-temp-context-directory";
import waitForStablePage from "@/utils/wait-for-stable-page";
import { getWalletExtensionPathFromCache } from "@/utils/wallets/get-wallet-extension-path-from-cache";
import unlock from "./actions/unlock";
import { Metamask } from "./metamask";
import { MetamaskProfile } from "./metamask-profile";

export type MetamaskFixture = {
    context: BrowserContext;
    metamask: Metamask;
    metamaskPage: Page;
};

let _metamaskPage: Page;

export const metamaskFixture = (slowMo: number = 0, profileName?: string) =>
    base.extend<MetamaskFixture>({
        context: async ({ context: currentContext, browserName }, use, testInfo) => {
            const wallet = new MetamaskProfile();

            const CACHE_DIR = getCacheDirectory(wallet.name);
            const extensionPath = await getWalletExtensionPathFromCache(wallet.name);
            const walletDataDir = path.resolve(CACHE_DIR, profileName ?? "wallet-data");

            if (!fs.existsSync(walletDataDir)) {
                throw new Error(`❌ Cache for MetaMask wallet data not found. Create it first`);
            }

            const tempWalletDataDir = await createTempContextDirectory(`${browserName}-${testInfo.testId}`);
            fs.cpSync(walletDataDir, tempWalletDataDir, { recursive: true });

            // const hasExtensionsInProfile = (dir: string): boolean => {
            //     try {
            //         const walk = (d: string, depth = 0): boolean => {
            //             if (depth > 4) return false;
            //             const items = fs.readdirSync(d, { withFileTypes: true });
            //             for (const it of items) {
            //                 if (it.isDirectory() && it.name.toLowerCase() === "extensions") return true;
            //                 if (it.isDirectory()) {
            //                     const found = walk(path.join(d, it.name), depth + 1);
            //                     if (found) return true;
            //                 }
            //             }
            //             return false;
            //         };
            //         return walk(dir);
            //     } catch {
            //         return false;
            //     }
            // };

            const browserArgs = [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`];

            if (process.env.HEADLESS) {
                browserArgs.push("--headless=new");

                if (slowMo > 0) {
                    console.warn("⚠️ Slow motion makes no sense in headless mode. It will be ignored!");
                }
            }

            console.log("Context path ---> ", tempWalletDataDir);

            const context = await chromium.launchPersistentContext(tempWalletDataDir, {
                headless: false,
                args: [],
                slowMo: process.env.HEADLESS ? 0 : slowMo,
            });

            const { cookies, origins } = await currentContext.storageState();
            if (cookies) await context.addCookies(cookies);
            if (origins && origins.length > 0) persistLocalStorage(origins, context);

            const indexUrl = await wallet.indexUrl();
            _metamaskPage = await getPageFromContext(context, indexUrl);

            await _metamaskPage.goto(indexUrl);
            await waitForStablePage(_metamaskPage);

            for (const page of context.pages()) {
                const url = page.url();
                if (url.includes(wallet.onboardingPath) || url.includes("about:blank")) {
                    await page.close();
                }
            }

            await _metamaskPage.bringToFront();

            await unlock(_metamaskPage);

            await use(context);

            await context.close();

            await removeTempContextDir(tempWalletDataDir);
        },
        metamask: async ({ context: _ }, use) => {
            const metamaskInstance = new Metamask(_metamaskPage);
            await use(metamaskInstance);
        },
    });
