import { expect } from "@playwright/test";
import { testWithMeteorFixture } from "@/tests/fixture/test-with-meteor-fixture";

const test = testWithMeteorFixture;

test("Should rename account successfully", async ({ meteor, meteorPage }) => {
    const NEW_ACCOUNT_NAME = "Ruka";
    await meteor.renameAccount({ newAccountName: NEW_ACCOUNT_NAME });

    const walletHeader = meteorPage.locator(`div:has(button[aria-label='open sidebar'])`).nth(2);
    const accountNameHeader = walletHeader.locator(`div:has(> h2:has-text('${NEW_ACCOUNT_NAME}'))`);
    const accountNameText = await accountNameHeader.textContent();
    expect(accountNameText).toBe(NEW_ACCOUNT_NAME);
});
