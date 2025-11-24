import { expect } from "@playwright/test";
import { testWithPetraFixture } from "@/tests/fixture/test-with-petra-fixture";
import { accountSelectors } from "@/wallets/petra/selectors/homepage-selectors";

const test = testWithPetraFixture;

test.describe("Switch account E2E tests", () => {
    test("Should switch account successfully", async ({ petra, petraPage }) => {
        const ACCOUNT_NAME = "Echo";

        await petra.switchAccount(ACCOUNT_NAME);

        const accountMenuButton = petraPage.locator(accountSelectors.accountOptionsMenuButton).first();
        const accountMenutButtonText = (await accountMenuButton.textContent())
            ?.split("Switch wallet")[1]
            ?.split("0x")[0];

        expect(accountMenutButtonText?.toLowerCase().trim()).toContain(ACCOUNT_NAME.toLowerCase().trim());
    });
});
