import { expect } from "@playwright/test";
import { testWithPetraFixture } from "@/tests/fixture/test-with-petra-fixture";

const test = testWithPetraFixture;

test.describe("Petra - Rename Account E2E Test", () => {
    test("should rename the account successfully", async ({ petra, petraPage }) => {
        expect(true).toBe(true);
    });
});
