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
import { unlock } from "./actions/unlock.solflare";
import { Solflare } from "./solflare";
import { SolflareProfile } from "./solflare-profile";
import type { SolflareFixture } from "./types";
import { autoCloseSolflareNotification } from "./utils";

let _solflarePage: Page;

export const solflareFixture = ({ slowMo = 0, profileName }: WalletProfileFixtureArgs = {}) => {
    return base.extend<SolflareFixture>({
        contextPath: async ({ browserName }, use, testInfo) => {
            const tempWalletDataDir = await createTempContextDirectory(`${browserName}-${testInfo.testId}`);
            await use(tempWalletDataDir);
        },
        context: async ({ context: currentContext, contextPath: tempWalletDataDir }, use) => {
            const wallet = new SolflareProfile();

            const CACHE_DIR = getCacheDirectory(wallet.name);
            const extensionPath = await getWalletExtensionPathFromCache(wallet.name);
            const walletDataDir = path.resolve(CACHE_DIR, profileName ?? "wallet-data");

            if (!fs.existsSync(walletDataDir)) {
                throw new Error(`❌ Cache for Solflare wallet data not found. Create it first`);
            }

            await fs.promises.cp(walletDataDir, tempWalletDataDir, { recursive: true, force: true });

            const browserArgs = getBrowserArgs(extensionPath, slowMo);
            const walletPageContext = await chromium.launchPersistentContext(tempWalletDataDir, {
                headless: false,
                args: browserArgs,
                slowMo: process.env.HEADLESS ? 0 : slowMo,
            });

            await walletPageContext.grantPermissions(["clipboard-read"]);

            const { cookies, origins } = await currentContext.storageState();
            if (cookies) await walletPageContext.addCookies(cookies);
            if (origins && origins.length > 0) await persistLocalStorage(origins, walletPageContext);

            const indexUrl = await wallet.indexUrl();
            const formatedIndexUrl = indexUrl.split("#")[0] ?? "";
            // Formatting the string here because the page URL returned in the predicate
            // points to the onboard's hash URL. So we need to ignore the hash part while matching.
            await walletPageContext.waitForEvent("page", {
                predicate: (page) => {
                    return page.url().includes(formatedIndexUrl);
                },
                timeout: 15_000,
            });
            const homePage = walletPageContext.pages().find((page) => page.url().startsWith(formatedIndexUrl));
            _solflarePage = homePage || (await getPageFromContext(walletPageContext, indexUrl));

            for (const page of walletPageContext.pages()) {
                const url = page.url();
                if (url.includes("about:blank")) await page.close();
            }

            await unlock(_solflarePage);

            await use(walletPageContext);
            await teardownContext(walletPageContext, tempWalletDataDir);
        },
        solflarePage: async ({ context: _ }, use) => {
            await use(_solflarePage);
        },
        solflare: async ({ context: _ }, use) => {
            const solflareInstance = new Solflare(_solflarePage);
            await use(solflareInstance);
        },
        autoCloseNotification: [
            async ({ context: _ }, use) => {
                const autoCloseController = new AbortController();
                const runner = autoCloseSolflareNotification(_solflarePage, autoCloseController.signal);

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
