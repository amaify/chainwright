import { testWithMeteorFixture } from "@/tests/fixture/test-with-meteor-fixture";

const test = testWithMeteorFixture;

test.describe("Meteor Wallet Lock wallet", () => {
    test("Should lock wallet successfully", async ({ meteor, meteorPage }) => {
        await meteor.lock();

        const unlockButton = meteorPage.locator('button:has-text("Unlock")');
        await test.expect(unlockButton).toBeVisible();
    });
});
