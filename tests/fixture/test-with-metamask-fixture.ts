import type { Page } from "@playwright/test";
import testWithPlaywrightKit from "@/core/test-with-playwright-kit";
import { metamaskFixture } from "@/wallets/metamask/metamask-fixture";

export const testWithMetamaskFixture = metamaskFixture();
export const testWithMetamask = testWithPlaywrightKit(metamaskFixture());

type TestDappFixture = {
    dappPage: Page;
};

export const testDappFixture = testWithMetamask.extend<TestDappFixture>({
    dappPage: async ({ page }, use) => {
        await page.goto("http://localhost:3000/polygon");
        await use(page);
    },
});
