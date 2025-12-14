import { expect } from "@playwright/test";
import { testWithsolflareFixture } from "@/tests/fixture/test-with-solflare-fixture";

const test = testWithsolflareFixture;

test("Should switch account successfully", async ({ solflare, solflarePage }) => {
    const WALLET_NAME = "Gamify";
    await solflare.switchAccount(WALLET_NAME);

    await expect(solflarePage.getByText(WALLET_NAME)).toBeVisible();
});
