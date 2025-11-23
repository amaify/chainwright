import fs from "node:fs";
import path from "node:path";
import { test as base, chromium, type Page } from "@playwright/test";
import createTempContextDirectory from "@/utils/create-temp-context-directory";
import getCacheDirectory from "@/utils/get-cache-directory";
import getPageFromContext from "@/utils/get-page-from-context";
import persistLocalStorage from "@/utils/persist-local-storage";
import { removeTempContextDir } from "@/utils/remove-temp-context-directory";
import { sleep } from "@/utils/sleep";
import { getWalletExtensionPathFromCache } from "@/utils/wallets/get-wallet-extension-path-from-cache";
import { unlock } from "./actions/unlock";
import { Phantom } from "./phantom";
import { PhantomProfile } from "./phantom-profile";

export type PhantomFixture = {
    contextPath: string;
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

            /**
             * Ideally, we shouldn't have "sleep" here.
             * But, it's a workaround to make sure that the wallet page is fully loaded.
             * Without this workaround, the fixture is flaky.
             * @TODO: INVESTIGATE WHY THIS HAPPENS. SPENT >6 HOURS AND COULDN'T FIND ANY PROPER SOLUTION
             */
            await sleep(300);
            const indexUrl = await wallet.indexUrl();
            _phantomPage = await getPageFromContext(walletPageContext, indexUrl);

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
    });
};
