import { testWithMeteorFixture } from "@/tests/fixture/test-with-meteor-fixture";

const test = testWithMeteorFixture;

test("Should get account address successfully", async ({ meteor }) => {
    const ACCOUNT_ADDRESS = "clearyam4913.testnet";
    const accountAddress = await meteor.getAccountAddress();
    test.expect(accountAddress).toBe(ACCOUNT_ADDRESS);
});
