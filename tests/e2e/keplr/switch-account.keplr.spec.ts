import { expect } from "@playwright/test";
import { testWithKeplrFixture } from "@/tests/fixture/test-with-keplr-fixture";

const test = testWithKeplrFixture;

test("Should switch account successfully", async ({ keplr, keplrPage }) => {
    await keplr.switchAccount({ currentAccountName: "Default", accountToSwitchTo: "Nino" });

    await expect(keplrPage.getByText("Nino")).toBeVisible();
});
