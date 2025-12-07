import { expect } from "@playwright/test";
import { testWithPetraFixture } from "@/tests/fixture/test-with-petra-fixture";

const test = testWithPetraFixture;

test("should unlock wallet successfully", async ({ petra, petraPage }) => {
    await petra.lock();

    await expect(petraPage.getByText("Welcome")).toBeVisible();

    await petra.unlock();
});
