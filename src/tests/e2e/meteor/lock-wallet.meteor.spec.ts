import { testWithMeteorFixture } from "@/tests/fixture/test-with-meteor-fixture";

const test = testWithMeteorFixture;

test("Should lock wallet successfully", async ({ meteor, meteorPage }) => {
    await meteor.lock();

    const unlockButton = meteorPage.locator('button:has-text("Unlock")');
    await test.expect(unlockButton).toBeVisible();
});
