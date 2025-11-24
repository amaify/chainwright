import { expect } from "@playwright/test";
import { phantomFixture } from "@/wallets/phantom";
import { menuSelectors } from "@/wallets/phantom/selectors/homepage-selectors";

const test = phantomFixture(1_000);

test.describe("Petra - Rename Account E2E Test", () => {
    test("should rename the account successfully", async ({ phantom, phantomPage }) => {
        const CURRENT_ACCOUNT = "Default";
        const NEW_ACCOUNT = "Ruka";

        await phantom.addAccount({
            accountName: CURRENT_ACCOUNT,
            chain: "Ethereum",
            privateKey: "db8b55484c15a6caa975c300345afadda6d8dffac951175282fc8cf136a4d83a",
        });

        await phantom.renameAccount({ currentAccountName: CURRENT_ACCOUNT, newAccountName: NEW_ACCOUNT });

        await expect(phantomPage.getByTestId(menuSelectors.homeHeaderAccountName)).toContainText(NEW_ACCOUNT);
    });
});
