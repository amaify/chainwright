import type { Page } from "@playwright/test";
import { homepageSelectors } from "../selectors/homepage-selectors";

export async function getAccountAddress(page: Page) {
    const addressesButton = page.getByTestId(homepageSelectors.accountAddressesButton);
    await addressesButton.click();

    const accountAddressElement = page.getByTestId(homepageSelectors.accountAddressesElements).first();
    const qrCodeButton = accountAddressElement.getByTestId(homepageSelectors.accountAddressQRCode);

    await qrCodeButton.click();
    const accountAddressDialog = page.getByRole("dialog");

    const accountAddressDiv = accountAddressDialog.locator("div > p[data-testid='account-address']");
    const accountAddress = await accountAddressDiv.textContent();

    return accountAddress;
}
