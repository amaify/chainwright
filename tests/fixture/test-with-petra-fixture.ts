import type { Page } from "@playwright/test";
import testWithPlaywrightKit from "@/core/test-with-playwright-kit";
import { petraFixture } from "@/wallets/petra/petra-fixture";

export const testWithPetraFixture = petraFixture();
export const testWithPetra = testWithPlaywrightKit(petraFixture());

type TestDappFixture = {
    dappPage: Page;
};

export const testDappFixture = testWithPetra.extend<TestDappFixture>({
    dappPage: async ({ page }, use) => {
        await page.goto("http://localhost:3000/aptos");
        await use(page);
    },
});
