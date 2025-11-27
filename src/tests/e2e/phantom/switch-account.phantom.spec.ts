import { expect } from "@playwright/test";
import { testWithPhantomFixture } from "@/tests/fixture/test-with-phantom-fixture";
import { menuSelectors } from "@/wallets/phantom/selectors/homepage-selectors";

const test = testWithPhantomFixture;

test.describe("Phantom Switch Account E2E Test", () => {
    test("Should switch to the specified account", async ({ phantom, phantomPage }) => {
        const ACCOUNT_NAME = "Ruka";

        await phantom.addAccount({
            accountName: ACCOUNT_NAME,
            chain: "Ethereum",
            privateKey: "db8b55484c15a6caa975c300345afadda6d8dffac951175282fc8cf136a4d83a",
        });

        await phantom.switchAccount(ACCOUNT_NAME);
        await expect(phantomPage.getByTestId(menuSelectors.homeHeaderAccountName)).toContainText(ACCOUNT_NAME);
    });
});
