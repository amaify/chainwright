import { expect } from "@playwright/test";
import { testWithMetamaskFixture } from "@/tests/fixture/test-with-metamask-fixture";

const test = testWithMetamaskFixture;

test("Should unlock wallet successfully", async ({ metamask, metamaskPage }) => {
    await metamask.lock();

    const unlockWalletInput = metamaskPage.getByTestId("unlock-password");
    await expect(unlockWalletInput).toBeVisible();

    await metamask.unlock();
});
