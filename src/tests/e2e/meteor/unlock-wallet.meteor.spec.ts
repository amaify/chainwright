import { testWithMeteorFixture } from "@/tests/fixture/test-with-meteor-fixture";

const test = testWithMeteorFixture;

test.describe("Meteor Wallet unlock wallet", () => {
    test("should unlock the wallet successfully", async ({ meteor, meteorPage }) => {
        await meteor.lock();

        const unlockButton = meteorPage.locator('button:has-text("Unlock")');
        await test.expect(unlockButton).toBeVisible();

        await meteor.unlock();
    });
});
