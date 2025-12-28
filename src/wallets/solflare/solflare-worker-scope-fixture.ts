import { test as base, type Page } from "@playwright/test";
import type { WorkerScopeFixtureArgs } from "@/types";
import { removeTempContextDir } from "@/utils/remove-temp-context-directory";
import { type WorkerScopeFixture, workerScopeContext } from "../utils/worker-scope-context";
import { Solflare } from "./solflare";
import { SolflareProfile } from "./solflare-profile";

export type SolflareFixture = {
    contextPath: string;
    solflare: Solflare;
    solflarePage: Page;
};

export const solflareWorkerScopeFixture = ({ slowMo, profileName, dappUrl }: WorkerScopeFixtureArgs = {}) => {
    return base.extend<SolflareFixture, WorkerScopeFixture<Solflare>>({
        workerScopeWalletPage: [
            async ({ browser: _ }, use, workerInfo) => {
                const wallet = new SolflareProfile();
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

                const solflare = new Solflare(walletPageFromContext);
                await solflare.unlock();
                await use({ wallet: solflare, walletPage: walletPageFromContext, context });

                await context.close();
                const error = await removeTempContextDir(contextPath);
                if (error) console.error(error);
            },
            { scope: "worker" },
        ],
        dappPage: [
            async ({ workerScopeWalletPage }, use) => {
                const { context } = workerScopeWalletPage;
                const dappPage = await context.newPage();
                if (dappUrl) {
                    await dappPage.goto(dappUrl);
                }
                await use(dappPage);
            },
            { scope: "worker" },
        ],
        solflarePage: async ({ workerScopeWalletPage }, use) => {
            await use(workerScopeWalletPage.walletPage);
        },
        solflare: async ({ workerScopeWalletPage }, use) => {
            const solflareInstance = new Solflare(workerScopeWalletPage.walletPage);
            await use(solflareInstance);
        },
    });
};
