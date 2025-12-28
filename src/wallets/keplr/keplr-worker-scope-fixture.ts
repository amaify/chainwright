import { test as base, type Page } from "@playwright/test";
import type { WorkerScopeFixtureArgs } from "@/types";
import { removeTempContextDir } from "@/utils/remove-temp-context-directory";
import { type WorkerScopeFixture, workerScopeContext } from "../utils/worker-scope-context";
import { Keplr } from "./keplr";
import { KeplrProfile } from "./keplr-profile";

export type KeplrFixture = {
    contextPath: string;
    keplr: Keplr;
    keplrPage: Page;
};

export const keplrWorkerScopeFixture = ({ slowMo, profileName, dappUrl }: WorkerScopeFixtureArgs = {}) => {
    return base.extend<KeplrFixture, WorkerScopeFixture<Keplr>>({
        workerScopeWalletPage: [
            async ({ browser: _ }, use, workerInfo) => {
                const wallet = new KeplrProfile();
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

                const keplr = new Keplr(walletPageFromContext);
                await keplr.unlock();

                await use({ wallet: keplr, walletPage: walletPageFromContext, context });

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
        keplrPage: async ({ workerScopeWalletPage }, use) => {
            await use(workerScopeWalletPage.walletPage);
        },
        keplr: async ({ workerScopeWalletPage }, use) => {
            const petraInstance = new Keplr(workerScopeWalletPage.walletPage);
            await use(petraInstance);
        },
    });
};
