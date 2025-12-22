import fs from "node:fs";
import path from "node:path";
import { chromium, type Page, type WorkerInfo } from "@playwright/test";
import createTempContextDirectory from "@/utils/create-temp-context-directory";
import getCacheDirectory from "@/utils/get-cache-directory";
import { getWalletExtensionPathFromCache } from "@/utils/wallets/get-wallet-extension-path-from-cache";
import type { BaseWallet } from "./base-wallet";

type WorkerScopeContext<W> = {
    workerInfo: WorkerInfo;
    wallet: W;
    profileName?: string;
    slowMo?: number;
};

export type WorkerScopeFixture<WalletPage> = {
    workerScopeWalletPage: {
        wallet: WalletPage;
        appPage: Page;
    };
};

// Create a worker context for all wallets
export async function workerScopeContext<T extends BaseWallet>({
    wallet,
    workerInfo,
    profileName,
    slowMo,
}: WorkerScopeContext<T>) {
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
    let page = context.pages()[0];

    if (!page) {
        page = await context.newPage();
    }

    await page.goto(indexUrl);

    return { context, walletPage: page, contextPath };
}
