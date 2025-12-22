import type { Page } from "@playwright/test";
import testWithPlaywrightKit from "@/core/test-with-playwright-kit";
import { keplrFixture } from "@/wallets/keplr/keplr-fixture";

export const testWithKeplrFixture = keplrFixture();
export const testWithKeplr = testWithPlaywrightKit(keplrFixture());

type TestDappFixture = {
    dappPage: Page;
};

export const testDappFixture = testWithKeplr.extend<TestDappFixture>({
    dappPage: async ({ page }, use) => {
        await page.goto("http://localhost:3000/injective");
        await use(page);
    },
});
