import { expect } from "@playwright/test";
import { testWithPhantomFixture } from "@/tests/fixture/test-with-phantom-fixture";
import { menuSelectors } from "@/wallets/phantom/selectors/homepage-selectors.phantom";

const test = testWithPhantomFixture;

test("Should add account via private key", async ({ phantom, phantomPage }) => {
    const ACCOUNT_NAME = "Ruka";

    await phantom.addAccount({
        accountName: ACCOUNT_NAME,
        chain: "Ethereum",
        privateKey: "0x28441de33adac31d474f08119cd1af56ddbdc77f111e9c7e186bb52c3bc2eceb",
    });

    await expect(phantomPage.getByTestId(menuSelectors.homeHeaderAccountName)).toContainText(ACCOUNT_NAME);
});
