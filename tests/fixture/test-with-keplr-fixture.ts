import type { Page } from "@playwright/test";
import testWithPlaywrightKit from "@/core/test-with-playwright-kit";
import { keplrFixture } from "@/wallets/keplr/keplr-fixture";
import { keplrWorkerScopeFixture } from "@/wallets/keplr/keplr-worker-scope-fixture";

export const testWithKeplrFixture = keplrFixture();
export const testWithKeplr = testWithPlaywrightKit(keplrFixture());
export const testWithKeplrWorkerScope = keplrWorkerScopeFixture({ dappUrl: "http://localhost:3000/injective" });

type TestDappFixture = {
    dappPage: Page;
};

export const testDappFixture = testWithKeplr.extend<TestDappFixture>({
    dappPage: async ({ page }, use) => {
        await page.goto("http://localhost:3000/injective");
        await use(page);
    },
});
