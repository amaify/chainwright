import { expect } from "@playwright/test";
import { testWithPetraFixture } from "@/tests/fixture/test-with-petra-fixture";

const test = testWithPetraFixture;

test("should lock the Petra wallet successfully", async ({ petra, petraPage }) => {
    await petra.lock();

    await expect(petraPage.getByText("Welcome")).toBeVisible();
    await expect(petraPage.getByText("Enter your password")).toBeVisible();
});
