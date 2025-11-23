import { expect } from "@playwright/test";
import { testWithMetamaskFixture } from "@/tests/fixture/test-with-metamask-fixture";

const test = testWithMetamaskFixture;

test.describe("E2E tests for unlocking wallet", () => {
    test("Should unlock wallet successfully", async ({ metamask, metamaskPage }) => {
        await metamask.lock();

        await expect(metamaskPage.getByText("Welcome")).toBeVisible();

        await metamask.unlock();
    });
});
