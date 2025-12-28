import { test as base, type Page } from "@playwright/test";
import { removeTempContextDir } from "@/utils/remove-temp-context-directory";
import { type WorkerScopeFixture, workerScopeContext } from "../utils/worker-scope-context";
import { Petra } from "./petra";
import { PetraProfile } from "./petra-profile";

export type PetraFixture = {
    contextPath: string;
    petra: Petra;
    petraPage: Page;
};

export const petraWorkerScopeFixture = (slowMo: number = 0, profileName?: string) => {
    return base.extend<PetraFixture, WorkerScopeFixture<Petra>>({
        workerScopeWalletPage: [
            async ({ browser: _ }, use, workerInfo) => {
                const wallet = new PetraProfile();
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

                const petra = new Petra(walletPageFromContext);
                await petra.unlock();

                await use({ wallet: petra, walletPage: walletPageFromContext });

                await context.close();
                const error = await removeTempContextDir(contextPath);
                if (error) console.error(error);
            },
            { scope: "worker" },
        ],
        petraPage: async ({ workerScopeWalletPage }, use) => {
            await use(workerScopeWalletPage.walletPage);
        },
        petra: async ({ workerScopeWalletPage }, use) => {
            const petraInstance = new Petra(workerScopeWalletPage.walletPage);
            await use(petraInstance);
        },
    });
};
