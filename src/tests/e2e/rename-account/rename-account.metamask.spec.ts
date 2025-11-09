import { expect } from "@playwright/test";
import { testWithMetamaskFixture } from "@/tests/fixture/test-with-metamask-fixture";
import { homepageSelectors } from "@/wallets/metamask/selectors/homepage-selectors";

const test = testWithMetamaskFixture;

test.describe("Rename account E2E tests", () => {
    test("Should rename account successfully", async ({ metamask, metamaskPage }) => {
        const OLD_ACCOUNT = "Latest account";
        const NEW_ACCOUNT = "New account";

        await metamask.renameAccount({ oldAccountName: OLD_ACCOUNT, newAccountName: NEW_ACCOUNT });

        const accountMenuButton = metamaskPage.getByTestId(homepageSelectors.accountMenuButton);

        await expect(metamaskPage.getByTestId("app-header-logo").first()).toBeVisible();
        await expect(accountMenuButton).toBeVisible();
        await expect(accountMenuButton).toContainText(NEW_ACCOUNT);
    });
});
