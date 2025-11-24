import { expect } from "@playwright/test";
import { testWithMetamaskFixture } from "@/tests/fixture/test-with-metamask-fixture";

const test = testWithMetamaskFixture;

test.describe("Lock Metamask Wallet", () => {
    test("should lock the Metamask wallet successfully", async ({ metamaskPage, metamask }) => {
        await metamask.lock();

        const unlockPageTitle = metamaskPage.getByTestId("unlock-page-title");
        await unlockPageTitle.waitFor({ state: "visible" });
        await expect(metamaskPage.getByTestId("unlock-page-title")).toBeVisible();
    });
});
