import { expect } from "@playwright/test";
import { testWithMetamaskFixture } from "@/tests/fixture/test-with-metamask-fixture";
import { homepageSelectors } from "@/wallets/metamask/selectors/homepage-selectors";

const test = testWithMetamaskFixture;

test.describe("Add custom network E2E tests", () => {
    test("Should add custom network successfully", async ({ metamask, metamaskPage }) => {
        await metamask.addCustomNetwork({
            networkName: "Gnosis",
            rpcUrl: "https://gnosis.oat.farm",
            chainId: 100,
            currencySymbol: "XDAI",
        });

        await expect(metamaskPage.getByTestId("app-header-logo").first()).toBeVisible();
        const networkButton = metamaskPage.getByTestId(homepageSelectors.openNetworkSelectorButton);
        await expect(networkButton).toContainText("Gnosis");
    });
});
