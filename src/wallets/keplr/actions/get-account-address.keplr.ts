import type { Page } from "@playwright/test";
import { type GetAccountAddressArgs, getAccountAddressSchema } from "../types";

type GetAccountAddress = GetAccountAddressArgs & { page: Page };

export async function getAccountAddress({ page, chain, walletName }: GetAccountAddress) {
    const parsedData = getAccountAddressSchema.parse({ chain, walletName });

    const copyWalletAddressContainer = page.locator(`div:has(div:has-text('${parsedData.walletName}'))`).nth(-3);
    const copyWalletAddressPopover = copyWalletAddressContainer.locator("div:has(> div > svg)");
    await copyWalletAddressPopover.click();

    const popoverContainer = page.locator("div:has(> div[data-simplebar='init'])").last();
    const popoverSearchContainer = popoverContainer.locator("div:has(> div > input)");
    const popoverSearchInput = popoverSearchContainer.locator("input");
    await popoverSearchInput.fill(parsedData.chain);
    await popoverContainer.press("Enter");

    const accountAddress = await page.evaluate(async () => await navigator.clipboard.readText());

    return accountAddress;
}
