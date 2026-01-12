import { test as base, type Page } from "@playwright/test";
import type { WorkerScopeFixtureArgs } from "@/types";
import { removeTempContextDir } from "@/utils/remove-temp-context-directory";
import { Metamask } from "./metamask";
import { type WorkerScopeFixture, workerScopeContextMetamask } from "./worker-scope-context.metamask";

export type MetamaskFixture = {
    contextPath: string;
    metamask: Metamask;
    metamaskPage: Page;
};

export const metamaskWorkerScopeFixture = ({ profileName, dappUrl, slowMo }: WorkerScopeFixtureArgs = {}) => {
    return base.extend<MetamaskFixture, WorkerScopeFixture>({
        workerScopeContents: [
            async ({ browser: _ }, use, workerInfo) => {
                const {
                    context,
                    contextPath,
                    walletPage: walletPageFromContext,
                } = await workerScopeContextMetamask({
                    workerInfo,
                    profileName,
                    slowMo,
                });
                await context.grantPermissions(["clipboard-read"]);
                const metamask = new Metamask(walletPageFromContext);
                await metamask.unlock();

                await use({ wallet: metamask, walletPage: walletPageFromContext, context });
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
        metamaskPage: async ({ workerScopeContents }, use) => {
            await use(workerScopeContents.walletPage);
        },
        metamask: async ({ workerScopeContents }, use) => {
            const metamaskInstance = new Metamask(workerScopeContents.walletPage);
            await use(metamaskInstance);
        },
    });
};
