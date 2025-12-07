import { expect } from "@playwright/test";
import { testWithMetamaskFixture } from "@/tests/fixture/test-with-metamask-fixture";

const test = testWithMetamaskFixture;

test("Should unlock wallet successfully", async ({ metamask, metamaskPage }) => {
    await metamask.lock();

    await expect(metamaskPage.getByText("Welcome")).toBeVisible();

    await metamask.unlock();
});
