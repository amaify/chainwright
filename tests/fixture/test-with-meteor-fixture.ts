import type { Page } from "@playwright/test";
import { meteorFixture } from "@/wallets/meteor";

export const testWithMeteorFixture = meteorFixture();
export const testFixtureWithNetworkProfile = meteorFixture(undefined, "multiple-network");

export const testDappFixture = testWithMeteorFixture.extend<{
    dappPage: Page;
}>({
    dappPage: async ({ page }, use) => {
        await page.goto("http://localhost:3000/near");
        await use(page);
    },
});
