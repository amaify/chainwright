import { expect } from "@playwright/test";
import { testWithsolflareFixture } from "@/tests/fixture/test-with-solflare-fixture";

const test = testWithsolflareFixture;

test("Should successfully unlock the wallet", async ({ solflare, solflarePage }) => {
    await solflare.lock();

    const unlockButon = solflarePage.getByTestId("btn-unlock");
    await expect(unlockButon).toBeVisible();

    await solflare.unlock();
    const settingsButton = solflarePage.getByRole("button", { name: "settings", exact: true });

    // Wait for the settings button to be visible during onboarding
    await settingsButton.waitFor({ state: "attached", timeout: 30_000 });
    await expect(settingsButton).toBeVisible();
});
