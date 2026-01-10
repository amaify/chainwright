import type { Page } from "@playwright/test";
import { meteorFixture } from "@/wallets/meteor";
import { meteorWorkerScopeFixture } from "@/wallets/meteor/meteor-worker-scope-fixture";

export const testWithMeteorFixture = meteorFixture();
export const testFixtureWithNetworkProfile = meteorFixture(undefined, "multiple-network");
export const testWithMeteorWorkerScope = meteorWorkerScopeFixture({
    dappUrl: "http://localhost:3000/near",
});

export const testDappFixture = testWithMeteorFixture.extend<{
    dappPage: Page;
}>({
    dappPage: async ({ page }, use) => {
        await page.goto("http://localhost:3000/near");
        await use(page);
    },
});
