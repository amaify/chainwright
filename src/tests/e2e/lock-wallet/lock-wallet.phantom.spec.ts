import { expect } from "@playwright/test";
import { testWithPhantomFixture } from "@/tests/fixture/test-with-phantom-fixture";

const test = testWithPhantomFixture;

test.describe("E2E test for locking wallet", () => {
    test("Should be able to lock wallet", async ({ phantom, phantomPage }) => {
        await phantom.lock();
        await expect(phantomPage.getByText("Enter your password")).toBeVisible();
    });
});
