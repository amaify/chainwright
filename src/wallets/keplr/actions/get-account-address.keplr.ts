import type { Locator, Page } from "@playwright/test";
import { type GetAccountAddressArgs, getAccountAddressSchema } from "../types";

type GetAccountAddress = GetAccountAddressArgs & { page: Page };

export async function getAccountAddress({ page, ...args }: GetAccountAddress) {
    const parsedData = getAccountAddressSchema.parse({ ...args });

    const copyWalletAddressContainer = page.locator(`div:has(div:has-text('${parsedData.walletName}'))`).nth(-3);
    const copyWalletAddressPopover = copyWalletAddressContainer.locator("div:has(> div > svg)");
    await copyWalletAddressPopover.click();

    const popoverContainer = page.locator("div:has(> div[data-simplebar='init'])").last();
    const popoverSearchContainer = popoverContainer.locator("div:has(> div > input)");
    const popoverSearchInput = popoverSearchContainer.locator("input");
    await popoverSearchInput.fill(parsedData.chain);

    const chains = await popoverContainer.locator("div[cursor='pointer']", { hasText: parsedData.chain }).all();
    let addressElement: Locator | undefined;

    for (const chain of chains) {
        let chainTag: string | undefined;
        if ("chainTag" in args) chainTag = args.chainTag;

        const chainElement = chain.locator(`div`, { hasText: parsedData.chain }).last();
        const chainTagElement = chainTag ? chain.locator("div", { hasText: chainTag }).last() : null;

        const isChainTagElementVisible = chainTagElement
            ? await chainTagElement?.isVisible().catch(() => false)
            : false;
        const chainTagTextContent = isChainTagElementVisible ? await chainTagElement?.textContent() : null;
        const chainTextContent = await chainElement.textContent();

        const combinedChainText = chainTagTextContent ? `${chainTextContent} ${chainTagTextContent}` : chainTextContent;
        const combinedParsedData = chainTag ? `${parsedData.chain} ${chainTag}` : parsedData.chain;

        if (combinedChainText === combinedParsedData) {
            addressElement = chainElement;
            break;
        }
    }

    if (!addressElement) {
        throw Error(`Address for ${parsedData.walletName} account on "${parsedData.chain}" chain not found.`);
    }

    // To get the address, we need to hover over the chain element and click on it.
    // using click() alone will not work. We need to hover first.
    await addressElement.hover();
    await addressElement.click();

    const accountAddress = await page.evaluate(async () => await navigator.clipboard.readText());
    return accountAddress;
}
