import { testFixtureWithNetworkProfile } from "@/tests/fixture/test-with-meteor-fixture";

const test = testFixtureWithNetworkProfile;

test("Should switch account successfully", async ({ meteor, meteorPage }) => {
    const ACCOUNT_NAME = "Alpha";

    await meteor.switchAccount(ACCOUNT_NAME);
    const headerContainer = meteorPage.locator("div:has(button[type='button'][aria-label='open sidebar'])").nth(-2);
    const accountNameContainer = headerContainer.locator("div:has(div > h2)");
    const activeAccountName = await accountNameContainer.locator("div > h2").textContent();
    test.expect(activeAccountName).toBe(ACCOUNT_NAME);
});
