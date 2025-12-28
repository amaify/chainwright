import { test as base, type Page } from "@playwright/test";
import { removeTempContextDir } from "@/utils/remove-temp-context-directory";
import { type WorkerScopeFixture, workerScopeContext } from "../utils/worker-scope-context";
import { Metamask } from "./metamask";
import { MetamaskProfile } from "./metamask-profile";

export type MetamaskFixture = {
    contextPath: string;
    metamask: Metamask;
    metamaskPage: Page;
};

export const metamaskWorkerScopeFixture = (slowMo: number = 0, profileName?: string) => {
    return base.extend<MetamaskFixture, WorkerScopeFixture<Metamask>>({
        workerScopeWalletPage: [
            async ({ browser: _ }, use, workerInfo) => {
                const wallet = new MetamaskProfile();
                const {
                    context,
                    contextPath,
                    walletPage: walletPageFromContext,
                } = await workerScopeContext({
                    wallet,
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

                const metamask = new Metamask(walletPageFromContext);
                await metamask.unlock();
                await use({ wallet: metamask, walletPage: walletPageFromContext });

                await context.close();
                const error = await removeTempContextDir(contextPath);
                if (error) console.error(error);
            },
            { scope: "worker" },
        ],
        metamaskPage: async ({ workerScopeWalletPage }, use) => {
            await use(workerScopeWalletPage.walletPage);
        },
        metamask: async ({ workerScopeWalletPage }, use) => {
            const solflareInstance = new Metamask(workerScopeWalletPage.walletPage);
            await use(solflareInstance);
        },
    });
};
