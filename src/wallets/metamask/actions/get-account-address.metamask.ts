import type { Page } from "@playwright/test";
import { homepageSelectors } from "../selectors/homepage-selectors.metamask";
import type { GetAccountAddressChains } from "../types";

export async function getAccountAddress(page: Page, network: GetAccountAddressChains) {
    const addressesButton = page.getByTestId(homepageSelectors.accountAddressesButton);
    await addressesButton.hover();

    const multiChainAddressList = page.getByTestId("multichain-address-rows-list");
    const viewAllButton = multiChainAddressList.getByRole("button", { name: /view all/i });
    await viewAllButton.click();

    const searchNetworkInput = page.getByRole("searchbox", { name: /search networks/i });
    await searchNetworkInput.fill(network);

    const accountAddressElement = page.locator(
        `div[data-testid='${homepageSelectors.accountAddressesElements}']:has-text('${network}')`,
    );
    const qrCodeButton = accountAddressElement.getByTestId(homepageSelectors.accountAddressQRCode);

    await qrCodeButton.click();
    const accountAddressDialog = page.getByRole("dialog");

    const accountAddressDiv = accountAddressDialog.locator("div > p[data-testid='account-address']");
    const accountAddress = await accountAddressDiv.textContent();

    return accountAddress;
}
