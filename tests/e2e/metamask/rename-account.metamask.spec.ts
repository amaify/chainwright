import { expect } from "@playwright/test";
import { testWithMetamaskFixture } from "@/tests/fixture/test-with-metamask-fixture";
import { homepageSelectors } from "@/wallets/metamask/selectors/homepage-selectors.metamask";

const test = testWithMetamaskFixture;

test("Should rename account successfully", async ({ metamask, metamaskPage }) => {
    const OLD_ACCOUNT = "Gamify";
    const NEW_ACCOUNT = "New account";

    await metamask.addAccount({
        privateKey: "df47c5bf98f2b01720914cde200ad63eb32663c10348b44c403305ac35f2dcf0",
        accountName: OLD_ACCOUNT,
    });

    await expect(metamaskPage.getByTestId("app-header-logo").first()).toBeVisible();

    await metamask.renameAccount({ currentAccountName: OLD_ACCOUNT, newAccountName: NEW_ACCOUNT });

    const accountMenuButton = metamaskPage.getByTestId(homepageSelectors.accountMenuButton);

    await expect(metamaskPage.getByTestId("app-header-logo").first()).toBeVisible();
    await expect(accountMenuButton).toBeVisible();
    await expect(accountMenuButton).toContainText(NEW_ACCOUNT);
});
