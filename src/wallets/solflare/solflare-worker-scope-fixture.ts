import { test as base, type Page } from "@playwright/test";
import type { WorkerScopeFixtureArgs } from "@/types";
import { removeTempContextDir } from "@/utils/remove-temp-context-directory";
import { Solflare } from "./solflare";
import { type WorkerScopeFixture, workerScopeContextSolana } from "./worker-scope-context.solflare";

export type SolflareFixture = {
    contextPath: string;
    solflare: Solflare;
    solflarePage: Page;
};

export const solflareWorkerScopeFixture = ({ slowMo, profileName, dappUrl }: WorkerScopeFixtureArgs = {}) => {
    return base.extend<SolflareFixture, WorkerScopeFixture>({
        workerScopeContents: [
            async ({ browser: _ }, use, workerInfo) => {
                const {
                    context,
                    contextPath,
                    walletPage: walletPageFromContext,
                } = await workerScopeContextSolana({
                    workerInfo,
                    profileName,
                    slowMo,
                });
                await context.grantPermissions(["clipboard-read"]);
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
            async ({ workerScopeContents }, use) => {
                const { context } = workerScopeContents;
                const dappPage = await context.newPage();
                if (dappUrl) {
                    await dappPage.goto(dappUrl);
                }
                await use(dappPage);
            },
            { scope: "worker" },
        ],
        solflarePage: async ({ workerScopeContents }, use) => {
            await use(workerScopeContents.walletPage);
        },
        solflare: async ({ workerScopeContents }, use) => {
            const solflareInstance = new Solflare(workerScopeContents.walletPage);
            await use(solflareInstance);
        },
    });
};
