import { testFixtureWithNetworkProfile } from "@/tests/fixture/test-with-meteor-fixture";

const test = testFixtureWithNetworkProfile;

test("Should switch account successfully", async ({ meteor, meteorPage }) => {
    await meteor.addAccount({
        accountName: "Zebra",
        network: "Testnet",
        privateKey: "ed25519:N46v79dASRWxD7fEVRkj1MC8HqR1jxmnkgUN8C1qwGXijeMG7aBF5QVJfaTCv2hf7HPumENNovm7i6752YLkqP9",
    });

    await meteor.switchAccount("Default");
    const headerContainer = meteorPage.locator("div:has(button[type='button'][aria-label='open sidebar'])").nth(-2);
    const accountNameContainer = headerContainer.locator("div:has(div > h2)");
    const activeAccountName = await accountNameContainer.locator("div > h2").textContent();
    test.expect(activeAccountName).toBe("Default");
});
