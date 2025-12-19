import { expect } from "@playwright/test";
import { testFixtureWithNetworkProfile } from "@/tests/fixture/test-with-meteor-fixture";

const testWithNetworkProfile = testFixtureWithNetworkProfile;

testWithNetworkProfile(
    "Should switch network from Mainnet to Testnet and vice-versa successfully",
    async ({ meteor }) => {
        await meteor.switchNetwork("Mainnet");
        const availableBalance = meteor.page.locator("p:has-text('Available Balance')");
        await expect(availableBalance).toBeVisible();
    },
);
