import { expect } from "@playwright/test";
import { testWithMetamaskFixture } from "@/tests/fixture/test-with-metamask-fixture";
import { homepageSelectors } from "@/wallets/metamask/selectors/homepage-selectors";

const test = testWithMetamaskFixture;

test.describe("Switch network E2E tests", () => {
    test("Should switch network successfully", async ({ metamask, metamaskPage }) => {
        await metamask.switchNetwork({ chainName: "Sepolia", networkType: "testnet" });

        await expect(metamaskPage.getByTestId("app-header-logo").first()).toBeVisible();
        await expect(metamaskPage.getByTestId(homepageSelectors.openNetworkSelectorButton)).toContainText("Sepolia");

        await metamask.switchNetwork({ chainName: "Ethereum", networkType: "mainnet" });

        await expect(metamaskPage.getByTestId("app-header-logo").first()).toBeVisible();
        await expect(metamaskPage.getByTestId(homepageSelectors.openNetworkSelectorButton)).toContainText("Ethereum");
    });
});
