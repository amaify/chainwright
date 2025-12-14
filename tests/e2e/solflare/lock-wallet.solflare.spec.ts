import { expect } from "@playwright/test";
import { testWithsolflareFixture } from "@/tests/fixture/test-with-solflare-fixture";

const test = testWithsolflareFixture;

test("Should successfully lock the wallet", async ({ solflare, solflarePage }) => {
    await solflare.lock();

    const unlockButon = solflarePage.getByTestId("btn-unlock");
    await expect(unlockButon).toBeVisible();
});
