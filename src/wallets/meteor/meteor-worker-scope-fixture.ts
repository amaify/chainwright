import { test as base, type Page } from "@playwright/test";
import type { WorkerScopeFixtureArgs } from "@/types";
import { removeTempContextDir } from "@/utils/remove-temp-context-directory";
import { type WorkerScopeFixture, workerScopeContext } from "../utils/worker-scope-context";
import { Meteor } from "./meteor";
import { MeteorProfile } from "./meteor-profile";

export type MeteorFixture = {
    contextPath: string;
    meteor: Meteor;
    meteorPage: Page;
};

export const meteorWorkerScopeFixture = ({ slowMo, profileName, dappUrl }: WorkerScopeFixtureArgs = {}) => {
    return base.extend<MeteorFixture, WorkerScopeFixture<Meteor>>({
        workerScopeContents: [
            async ({ browser: _ }, use, workerInfo) => {
                const wallet = new MeteorProfile();
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

                const meteor = new Meteor(walletPageFromContext);
                await meteor.unlock();

                await use({ wallet: meteor, walletPage: walletPageFromContext, context });

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
        meteorPage: async ({ workerScopeContents }, use) => {
            await use(workerScopeContents.walletPage);
        },
        meteor: async ({ workerScopeContents }, use) => {
            const meteorInstance = new Meteor(workerScopeContents.walletPage);
            await use(meteorInstance);
        },
    });
};
