import fs from "node:fs";
import path from "node:path";
import { test as base, chromium, type Page } from "@playwright/test";
import type { WalletProfileFixtureArgs } from "@/types";
import createTempContextDirectory from "@/utils/create-temp-context-directory";
import getCacheDirectory from "@/utils/get-cache-directory";
import getPageFromContext from "@/utils/get-page-from-context";
import persistLocalStorage from "@/utils/persist-local-storage";
import { teardownContext } from "@/utils/teardown-context";
import { getWalletExtensionPathFromCache } from "@/utils/wallets/get-wallet-extension-path-from-cache";
import { getBrowserArgs } from "../utils/get-browser-args";
import { unlock } from "./actions/unlock.phantom";
import { Phantom } from "./phantom";
import { PhantomProfile } from "./phantom-profile";
import type { PhantomFixture } from "./types";
import { autoClosePhantomNotification } from "./utils";

let _phantomPage: Page;

export const phantomFixture = ({ slowMo = 0, profileName }: WalletProfileFixtureArgs = {}) => {
    return base.extend<PhantomFixture>({
        contextPath: async ({ browserName }, use, testInfo) => {
            const tempWalletDataDir = await createTempContextDirectory(`${browserName}-${testInfo.testId}`);

            await use(tempWalletDataDir);
        },
        context: async ({ context: currentContext, contextPath: tempWalletDataDir }, use) => {
            const wallet = new PhantomProfile();

            const CACHE_DIR = getCacheDirectory(wallet.name);
            const extensionPath = await getWalletExtensionPathFromCache(wallet.name);
            const walletDataDir = path.resolve(CACHE_DIR, profileName ?? "wallet-data");

            if (!fs.existsSync(walletDataDir)) {
                throw new Error(`❌ Cache for Phantom wallet data not found. Create it first`);
            }

            fs.cpSync(walletDataDir, tempWalletDataDir, { recursive: true, force: true });

            const browserArgs = getBrowserArgs(extensionPath, slowMo);
            const walletPageContext = await chromium.launchPersistentContext(tempWalletDataDir, {
                headless: false,
                args: browserArgs,
                slowMo: process.env.HEADLESS ? 0 : slowMo,
            });

            await walletPageContext.grantPermissions(["clipboard-read"]);

            const { cookies, origins } = await currentContext.storageState();
            if (cookies) await walletPageContext.addCookies(cookies);
            if (origins && origins.length > 0) {
                await persistLocalStorage(origins, walletPageContext);
            }

            const indexUrl = await wallet.indexUrl();
            const homePage = walletPageContext.pages().find((page) => page.url().startsWith(indexUrl));
            _phantomPage = homePage || (await getPageFromContext(walletPageContext, indexUrl));

            for (const page of walletPageContext.pages()) {
                const url = page.url();
                if (url.includes("about:blank")) {
                    await page.close();
                }
            }

            await _phantomPage.bringToFront();
            await unlock(_phantomPage);
            await use(walletPageContext);
            await teardownContext(walletPageContext, tempWalletDataDir);
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
                const autoCloseController = new AbortController();
                const runner = autoClosePhantomNotification(_phantomPage, autoCloseController.signal);

                await use(undefined);

                autoCloseController.abort();
                await runner.catch((error) => {
                    console.error(`Auto close notification error: ${(error as Error).message}`);
                });
            },
            { auto: true },
        ],
    });
};
