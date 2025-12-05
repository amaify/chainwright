import { expect } from "@playwright/test";
import { testWithPhantomFixture } from "@/tests/fixture/test-with-phantom-fixture";
import { menuSelectors } from "@/wallets/phantom/selectors/homepage-selectors.phantom";

const test = testWithPhantomFixture;

test.describe("E2E For Adding account in Phantom wallet", () => {
    test("Should add account via private key", async ({ phantom, phantomPage }) => {
        const ACCOUNT_NAME = "Ruka";

        await phantom.addAccount({
            accountName: ACCOUNT_NAME,
            chain: "Ethereum",
            privateKey: "db8b55484c15a6caa975c300345afadda6d8dffac951175282fc8cf136a4d83a",
        });

        await expect(phantomPage.getByTestId(menuSelectors.homeHeaderAccountName)).toContainText(ACCOUNT_NAME);
    });
});
