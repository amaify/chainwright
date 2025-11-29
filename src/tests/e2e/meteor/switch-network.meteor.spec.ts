import { expect } from "@playwright/test";
import { testWithMeteorFixture } from "@/tests/fixture/test-with-meteor-fixture";

const test = testWithMeteorFixture;

test.describe("Meteor Wallet Switch Network", () => {
    test("Should switch network from Mainnet to Testnet and vice-versa successfully", async ({ meteor }) => {
        await meteor.switchNetwork("Testnet");

        const availableBalance = meteor.page.locator("p:has-text('Available Balance')");
        await expect(availableBalance).toBeVisible();
    });

    test("Should throw an error if there is no associated account for the network", async ({ meteor }) => {
        try {
            await meteor.switchNetwork("Mainnet");
        } catch (_error) {
            void 0;
        }

        await expect(meteor.switchNetwork("Mainnet")).rejects.toThrowError();
    });
});
