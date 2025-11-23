import { expect } from "@playwright/test";
import { testWithPhantomFixture } from "@/tests/fixture/test-with-phantom-fixture";

const test = testWithPhantomFixture;

test.describe("E2E test for unlocking wallet", () => {
    test("Should unlock wallet successfully", async ({ phantom, phantomPage }) => {
        await phantom.lock();

        await expect(phantomPage.getByText("Welcome")).toBeVisible();

        await phantom.unlock();
    });
});
