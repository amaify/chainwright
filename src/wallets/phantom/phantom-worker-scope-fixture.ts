import { test as base, type Page } from "@playwright/test";
import type { WorkerScopeFixtureArgs } from "@/types";
import { removeTempContextDir } from "@/utils/remove-temp-context-directory";
import type { WorkerScopeFixture } from "../utils/worker-scope-context";
import { Phantom } from "./phantom";
import { autoClosePhantomNotification } from "./utils";
import { workerScopeContextPhantom } from "./worker-scope-context.phantom";

export type PhantomFixture = {
    contextPath: string;
    phantom: Phantom;
    phantomPage: Page;
    autoCloseNotification: undefined;
};

export const phantomWorkerScopeFixture = ({ slowMo, profileName, dappUrl }: WorkerScopeFixtureArgs = {}) => {
    return base.extend<PhantomFixture, WorkerScopeFixture<Phantom>>({
        workerScopeContents: [
            async ({ browser: _ }, use, workerInfo) => {
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
                    if (page.url().includes("about:blank")) {
                        await page.close();
                    }
                }

                const phantom = new Phantom(walletPageFromContext);
                await phantom.unlock();

                await use({ wallet: phantom, walletPage: walletPageFromContext, context });

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
        phantomPage: async ({ workerScopeContents }, use) => {
            await use(workerScopeContents.walletPage);
        },
        phantom: async ({ workerScopeContents }, use) => {
            const phantomInstance = new Phantom(workerScopeContents.walletPage);
            await use(phantomInstance);
        },
        autoCloseNotification: [
            async ({ workerScopeContents }, use) => {
                let cancelled = false;
                const isCancelled = () => cancelled;
                const runner = autoClosePhantomNotification(workerScopeContents.walletPage, isCancelled);

                await use(undefined);

                cancelled = true;
                await runner.catch((error) => {
                    console.error(`Auto close notification error: ${(error as Error).message}`);
                });
            },
            { auto: true },
        ],
    });
};
