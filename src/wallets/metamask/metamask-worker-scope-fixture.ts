import { test as base, type Page } from "@playwright/test";
import type { WorkerScopeFixtureArgs } from "@/types";
import { removeTempContextDir } from "@/utils/remove-temp-context-directory";
import { type WorkerScopeFixture, workerScopeContext } from "../utils/worker-scope-context";
import { Metamask } from "./metamask";
import { MetamaskProfile } from "./metamask-profile";

export type MetamaskFixture = {
    contextPath: string;
    metamask: Metamask;
    metamaskPage: Page;
};

export const metamaskWorkerScopeFixture = ({ profileName, dappUrl, slowMo }: WorkerScopeFixtureArgs = {}) => {
    return base.extend<MetamaskFixture, WorkerScopeFixture<Metamask>>({
        workerScopeContents: [
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

                // Close duplicate homepages.
                for (const page of context.pages()) {
                    const unlockButton = page.getByTestId("unlock-submit");
                    const isUnlockButtonVisible = await unlockButton.isVisible().catch(() => false);

                    if (isUnlockButtonVisible) {
                        await page.close();
                    }
                }
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
