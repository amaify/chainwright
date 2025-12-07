import { testWithMeteorFixture } from "@/tests/fixture/test-with-meteor-fixture";

const test = testWithMeteorFixture;

test("should add an account successfully", async ({ meteor }) => {
    await meteor.addAccount({
        accountName: "Alpha",
        network: "Mainnet",
        privateKey: "ed25519:mGMo7jVmHRUtoy88eKHatSQ2Em9pW75bPthTikyc9R5rLUGi7bEdxPwTTNdX5f83PPy3xc5cjbMpZHmnm62fK4J",
    });
});
