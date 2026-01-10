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
import { unlock } from "./actions/unlock.meteor";
import { Meteor } from "./meteor";
import { MeteorProfile } from "./meteor-profile";

export type MeteorFixture = {
    contextPath: string;
    meteor: Meteor;
    meteorPage: Page;
};

let _meteorPage: Page;

export const meteorFixture = (slowMo: number = 0, profileName?: string) => {
    return base.extend<MeteorFixture>({
        contextPath: async ({ browserName }, use, testInfo) => {
            const tempWalletDataDir = await createTempContextDirectory(`${browserName}-${testInfo.testId}`);
            await use(tempWalletDataDir);
            const error = await removeTempContextDir(tempWalletDataDir);

            if (error) {
                console.error(error);
            }
        },
        context: async ({ context: currentContext, contextPath: tempWalletDataDir }, use) => {
            const wallet = new MeteorProfile();

            const CACHE_DIR = getCacheDirectory(wallet.name);
            const extensionPath = await getWalletExtensionPathFromCache(wallet.name);
            const walletDataDir = path.resolve(CACHE_DIR, profileName ?? "wallet-data");

            if (!fs.existsSync(walletDataDir)) {
                throw new Error(`❌ Cache for Meteor wallet data not found. Create it first`);
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
            if (origins && origins.length > 0) persistLocalStorage(origins, walletPageContext);

            const indexUrl = await wallet.indexUrl();
            const homePage = walletPageContext.pages().find((page) => page.url().startsWith(indexUrl));
            _meteorPage = homePage || (await getPageFromContext(walletPageContext, indexUrl));

            await waitForStablePage(_meteorPage);

            for (const page of walletPageContext.pages()) {
                const url = page.url();
                if (url.includes("about:blank")) {
                    await page.close();
                }
            }

            await _meteorPage.bringToFront();
            await unlock(_meteorPage);
            await use(walletPageContext);
            await walletPageContext.close();
        },
        meteorPage: async ({ context: _ }, use) => {
            await use(_meteorPage);
        },
        meteor: async ({ context: _ }, use) => {
            const meteorInstance = new Meteor(_meteorPage);
            await use(meteorInstance);
        },
    });
};
