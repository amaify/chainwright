import { expect } from "@playwright/test";
import { testWithPhantomFixture } from "@/tests/fixture/test-with-phantom-fixture";
import { menuSelectors } from "@/wallets/phantom/selectors/homepage-selectors.phantom";

const test = testWithPhantomFixture;

test("Should toggle optional chains", async ({ phantom, phantomPage }) => {
    await phantom.toggleOptionalChains({ supportedChains: ["Monad", "Bitcoin"], toggleMode: "off" });
    await expect(phantomPage.getByTestId(menuSelectors.homeHeaderAccountName)).toBeVisible();
    await phantom.toggleOptionalChains({ supportedChains: ["Monad", "Bitcoin"], toggleMode: "on" });
    await expect(phantomPage.getByTestId(menuSelectors.homeHeaderAccountName)).toBeVisible();
});
