import type { Page } from "@playwright/test";
import testWithPlaywrightKit from "@/core/test-with-playwright-kit";
import { phantomFixture } from "@/wallets/phantom";
import { phantomWorkerScopeFixture } from "@/wallets/phantom/phantom-worker-scope-fixture";

export const testWithPhantomFixture = phantomFixture();
export const testWithPhantom = testWithPlaywrightKit(phantomFixture());
export const testWithPhantomWorkerScope = phantomWorkerScopeFixture({
    dappUrl: "http://localhost:3000/solana",
});

type TestDappFixture = {
    dappPage: Page;
};

export const testDappFixture = testWithPhantom.extend<TestDappFixture>({
    dappPage: async ({ page }, use) => {
        await page.goto("http://localhost:3000/solana");
        await use(page);
    },
});
