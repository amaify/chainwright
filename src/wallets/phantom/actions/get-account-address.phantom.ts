import type { Page } from "@playwright/test";
import { menuSelectors, settingsSelectors } from "../selectors/homepage-selectors.phantom";
import type { GetAccountAddress } from "../types";

type GetAccountAddressArgs = GetAccountAddress & { page: Page };

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export async function getAccountAddress({ page, accountName, chain }: GetAccountAddressArgs) {
    const openMenuButton = page.getByTestId(menuSelectors.openMenuButton);
    await openMenuButton.click();

    const manageAccountsButton = page.getByTestId(menuSelectors.manageAccountsButton);
    await manageAccountsButton.click();

    const accountProfileToSelect = page.getByTestId(`manage-accounts-sortable-${accountName}`);
    await accountProfileToSelect.click();

    const accountAddressesButton = page.getByRole("button", { name: /Account Address(?:es)?/i });
    await accountAddressesButton.waitFor({ state: "visible", timeout: 20_000 });
    const numberOfAddress = accountAddressesButton.locator("div[data-name='row.pair'] > div").last();
    const _numberOfAddress = await numberOfAddress.textContent();

    /**
     * If there is only one address associated with the account, we can click directly on the address to copy it.
     * If there are multiple addresses, we need to open the account details page and click on the copy button for the specific chain address.
     */
    if (_numberOfAddress && Number(_numberOfAddress) === 1) {
        await accountAddressesButton.locator("> div > div").last().click();

        const headerBackButton = page.getByTestId("header--back");
        await headerBackButton.click();

        const settingsCloseButton = page.getByTestId(settingsSelectors.closeMenuButton);
        await settingsCloseButton.waitFor({ state: "visible", timeout: 15_000 });
        await settingsCloseButton.click();
    } else {
        await accountAddressesButton.click();
        const re = new RegExp(`${escapeRegExp(chain.network)}`, "i");
        const chainAddressToCopyButton = page.getByRole("button", { name: re });
        const contentContainer = chainAddressToCopyButton.locator("> div").last();
        const actionsContainer = contentContainer.locator("> div").last();
        const copyButton = actionsContainer.locator("div > button").last();
        await copyButton.click();

        const closeButton = page.getByRole("button", { name: "Close", exact: true }).last();
        await closeButton.click();

        const headerBackButton = page.getByTestId("header--back");
        await headerBackButton.waitFor({ state: "visible", timeout: 15_000 });
        await headerBackButton.click();

        const settingsCloseButton = page.getByTestId(settingsSelectors.closeMenuButton);
        await settingsCloseButton.waitFor({ state: "visible", timeout: 15_000 });
        await settingsCloseButton.click();
    }

    const copiedAddress = await page.evaluate(async () => await navigator.clipboard.readText());
    return copiedAddress;
}
