import { test as base } from "@playwright/test";
import type { WalletProfileFixtureArgs } from "@/types";
import { teardownContext } from "@/utils/teardown-context";
import type { WorkerScopeFixture } from "../utils/worker-scope-context";
import { Solflare } from "./solflare";
import type { SolflareFixture } from "./types";
import { autoCloseSolflareNotification } from "./utils";
import { workerScopeContextSolana } from "./worker-scope-context.solflare";

export const solflareWorkerScopeFixture = ({ slowMo, profileName }: WalletProfileFixtureArgs = {}) => {
    return base.extend<SolflareFixture, WorkerScopeFixture<Solflare>>({
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
                await teardownContext(context, contextPath);
            },
            { scope: "worker" },
        ],
        autoCloseNotification: [
            async ({ workerScopeContents }, use) => {
                const autoCloseController = new AbortController();
                const runner = autoCloseSolflareNotification(
                    workerScopeContents.walletPage,
                    autoCloseController.signal,
                );

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
