import { expect } from "@playwright/test";
import { testWithKeplrFixture } from "@/tests/fixture/test-with-keplr-fixture";

const test = testWithKeplrFixture;

test("Should unlock wallet successfully", async ({ keplr, keplrPage }) => {
    await keplr.lock();

    const welcomeBackText = keplrPage.getByText("Welcome Back");
    await expect(welcomeBackText).toBeVisible();

    await keplr.unlock();
});
