import { expect } from "@playwright/test";
import { testWithPhantomFixture } from "@/tests/fixture/test-with-phantom-fixture";
import { menuSelectors } from "@/wallets/phantom/selectors/homepage-selectors";

const test = testWithPhantomFixture;

test.describe("Phantom - Rename Account E2E Test", () => {
    test("should rename the account successfully", async ({ phantom, phantomPage }) => {
        const ACCOUNT_TO_RENAME = "Foxtrot";
        const ACCOUNT_TO_ADD = "Ruka";

        await phantom.addAccount({
            accountName: ACCOUNT_TO_ADD,
            chain: "Ethereum",
            privateKey: "db8b55484c15a6caa975c300345afadda6d8dffac951175282fc8cf136a4d83a",
        });

        await phantom.renameAccount({ currentAccountName: ACCOUNT_TO_ADD, newAccountName: ACCOUNT_TO_RENAME });
        await expect(phantomPage.getByTestId(menuSelectors.homeHeaderAccountName)).toContainText(ACCOUNT_TO_RENAME);
    });
});
