import type { Page } from "@playwright/test";
import testWithPlaywrightKit from "@/core/test-with-playwright-kit";
import { solflareFixture } from "@/wallets/solflare/solflare-fixture";
import { solflareWorkerScopeFixture } from "@/wallets/solflare/solflare-worker-scope-fixture";

export const testWithsolflareFixture = solflareFixture();
export const testWithSolflare = testWithPlaywrightKit(solflareFixture());
export const testWithSolflareWorkerScope = solflareWorkerScopeFixture({
    dappUrl: "http://localhost:3000/solana",
});

type TestDappFixture = {
    dappPage: Page;
};

export const testDappFixture = testWithSolflare.extend<TestDappFixture>({
    dappPage: async ({ page }, use) => {
        await page.goto("http://localhost:3000/solana");
        await use(page);
    },
});
