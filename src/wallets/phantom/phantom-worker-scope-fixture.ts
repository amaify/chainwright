import { test as base } from "@playwright/test";
import type { WalletProfileFixtureArgs } from "@/types";
import { teardownContext } from "@/utils/teardown-context";
import type { WorkerScopeFixture } from "../utils/worker-scope-context";
import { Phantom } from "./phantom";
import type { PhantomFixture } from "./types";
import { autoClosePhantomNotification } from "./utils";
import { workerScopeContextPhantom } from "./worker-scope-context.phantom";

export const phantomWorkerScopeFixture = ({ slowMo, profileName }: WalletProfileFixtureArgs = {}) => {
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
                await teardownContext(context, contextPath);
            },
            { scope: "worker" },
        ],
        autoCloseNotification: [
            async ({ workerScopeContents }, use) => {
                const autoCloseController = new AbortController();
                const runner = autoClosePhantomNotification(workerScopeContents.walletPage, autoCloseController.signal);

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
