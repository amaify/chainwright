import type { Locator, Page } from "@playwright/test";
import z from "zod";
import { menuSelectors } from "../selectors/homepage-selectors.phantom";
import type { GetAccountAddress } from "../types";

type GetAccountAddressArgs = GetAccountAddress & { page: Page };

export async function getAccountAddress({ page, accountName, chain }: GetAccountAddressArgs) {
    const parsedAccountName = z.string().min(1, "Account name cannot be an empty string").parse(accountName);
    const openMenuButton = page.getByTestId(menuSelectors.openMenuButton);
    await openMenuButton.click();

    let accountListButton: Locator | null = null;
    const accountButton = await page
        .locator(`div[data-testid='account-menu'] div[data-testid='tooltip_interactive-wrapper']`)
        .all();

    for (const account of accountButton) {
        const textContent = await account.textContent();
        if (textContent?.includes(parsedAccountName)) {
            accountListButton = account;
            break;
        }
    }

    if (!accountListButton) {
        throw new Error(`Account with name "${parsedAccountName}" not found in the account list.`);
    }

    await accountListButton.hover();

    // Get the tooltip menu that cointains the address.
    const tooltipMenu = accountListButton.locator(`div:has-text('${parsedAccountName}')`).nth(-2);
    const addressElement = tooltipMenu.locator(`div > p:has-text('${chain}')`);

    const isAddressElementVisible = await addressElement.isVisible().catch(() => false);
    if (!isAddressElementVisible) {
        throw Error(
            [
                `Address for chain "${chain}" not found for account "${parsedAccountName}".`,
                `To get the account address for ${chain}, please import the account for the ${chain} network.`,
            ].join(" "),
        );
    }

    await addressElement.click();
    const copiedAddress = await page.evaluate(() => navigator.clipboard.readText());

    return copiedAddress;
}
