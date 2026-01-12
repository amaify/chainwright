import fs from "node:fs";
import path from "node:path";
import { type BrowserContext, chromium, type Page, type WorkerInfo } from "@playwright/test";
import createTempContextDirectory from "@/utils/create-temp-context-directory";
import getCacheDirectory from "@/utils/get-cache-directory";
import waitForStablePage from "@/utils/wait-for-stable-page";
import { getWalletExtensionPathFromCache } from "@/utils/wallets/get-wallet-extension-path-from-cache";
import type { Metamask } from "./metamask";
import { MetamaskProfile } from "./metamask-profile";

type WorkerScopeContext = {
    workerInfo: WorkerInfo;
    profileName?: string;
    slowMo?: number;
};

export type WorkerScopeFixture = {
    workerScopeContents: {
        wallet: Metamask;
        walletPage: Page;
        context: BrowserContext;
    };
    dappPage: Page;
};

// Create a worker context for all wallets
export async function workerScopeContextMetamask({ workerInfo, profileName, slowMo }: WorkerScopeContext) {
    const wallet = new MetamaskProfile();
    const contextPath = await createTempContextDirectory(workerInfo.workerIndex.toString());
    const CACHE_DIR = getCacheDirectory(wallet.name);
    const walletDataDir = path.resolve(CACHE_DIR, profileName ?? "wallet-data");

    if (!fs.existsSync(walletDataDir)) {
        throw new Error(`Cache for ${wallet.name} does not exist. Create it first!`);
    }

    fs.cpSync(walletDataDir, contextPath, { recursive: true, force: true });
    const walletPath = await getWalletExtensionPathFromCache(wallet.name);

    const context = await chromium.launchPersistentContext(contextPath, {
        headless: false,
        args: [`--disable-extensions-except=${walletPath}`],
        slowMo: process.env.HEADLESS ? 0 : slowMo,
    });

    const indexUrl = await wallet.indexUrl();
    await context.waitForEvent("page", {
        predicate: (page) => page.url().startsWith(indexUrl),
        timeout: 15_000,
    });
    let page = context.pages().find((page) => page.url().startsWith(indexUrl));

    if (!page) {
        page = await context.newPage();
        await page.goto(indexUrl);
        await waitForStablePage(page);
    }

    for (const page of context.pages()) {
        if (page.url().includes("about:blank")) {
            await page.close();
        }
    }

    return { context, walletPage: page, contextPath };
}
