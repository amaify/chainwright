import { expect } from "@playwright/test";
import { testWithMetamaskFixture } from "@/tests/fixture/test-with-metamask-fixture";

const test = testWithMetamaskFixture;

test("should lock the Metamask wallet successfully", async ({ metamaskPage, metamask }) => {
    await metamask.lock();

    const unlockWalletInput = metamaskPage.getByTestId("unlock-password");
    await expect(unlockWalletInput).toBeVisible();
});
