import { test as base, type Page } from "@playwright/test";
import { removeTempContextDir } from "@/utils/remove-temp-context-directory";
import type { WorkerScopeFixture } from "../utils/worker-scope-context";
import { workerScopeContextPhantom } from "../utils/worker-scope-context.phantom";
import { Phantom } from "./phantom";
import { PhantomProfile } from "./phantom-profile";
import { autoClosePhantomNotification } from "./utils";

export type PhantomFixture = {
    contextPath: string;
    phantom: Phantom;
    phantomPage: Page;
    // biome-ignore lint/suspicious/noConfusingVoidType: Nothing
    autoCloseNotification: void;
};

export const phantomWorkerScopeFixture = (slowMo: number = 0, profileName?: string) => {
    return base.extend<PhantomFixture, WorkerScopeFixture<Phantom>>({
        workerScopeWalletPage: [
            async ({ browser: _ }, use, workerInfo) => {
                const wallet = new PhantomProfile();
                const {
                    context,
                    contextPath,
                    walletPage: walletPageFromContext,
                } = await workerScopeContextPhantom({
                    workerInfo,
                    profileName,
                    slowMo,
                });

                await context.grantPermissions(["clipboard-read"]);
                for (const page of context.pages()) {
                    if (page.url().includes(wallet.onboardingPath)) {
                        await page.close();
                    }
                }

                const phantom = new Phantom(walletPageFromContext);
                await phantom.unlock();

                await use({ wallet: phantom, walletPage: walletPageFromContext });

                await context.close();
                const error = await removeTempContextDir(contextPath);
                if (error) console.error(error);
            },
            { scope: "worker" },
        ],
        phantomPage: async ({ workerScopeWalletPage }, use) => {
            await use(workerScopeWalletPage.walletPage);
        },
        phantom: async ({ workerScopeWalletPage }, use) => {
            const phantomInstance = new Phantom(workerScopeWalletPage.walletPage);
            await use(phantomInstance);
        },
        autoCloseNotification: [
            async ({ workerScopeWalletPage }, use) => {
                let cancelled = false;
                const isCancelled = () => cancelled;
                const runner = autoClosePhantomNotification(workerScopeWalletPage.walletPage, isCancelled);

                await use();

                cancelled = true;
                await runner.catch((error) => {
                    console.error(`Auto close notification error: ${(error as Error).message}`);
                });
            },
            { auto: true },
        ],
    });
};
