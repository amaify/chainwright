import { expect } from "@playwright/test";
import { testWithKeplrFixture } from "@/tests/fixture/test-with-keplr-fixture";

const test = testWithKeplrFixture;

test("Should rename the account successfully", async ({ keplr, keplrPage }) => {
    await keplr.renameAccount({ currentAccountName: "Default", newAccountName: "New Account" });

    expect(keplrPage.getByText("New Account").first()).toBeVisible({ timeout: 10000 });
});
