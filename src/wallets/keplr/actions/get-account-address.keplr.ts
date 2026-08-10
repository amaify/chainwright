import { expect, type Locator, type Page } from "@playwright/test";
import type { GetAccountAddressArgs } from "../types";

type GetAccountAddress = GetAccountAddressArgs & { page: Page };

export async function getAccountAddress({ page, ...args }: GetAccountAddress) {
    // Make sure that the assets are visible before copying the account address
    const spendableAssetSearchbar = page.getByRole("textbox", {
        name: "Search for asset or chain (i.e. ATOM, Cosmos)",
        exact: true,
    });

    await spendableAssetSearchbar.fill(args.chain);
    const spendableAssetList = page
        .locator(`div:has-text("${args.chain}")`)
        .nth(-2)
        .filter({ hasNot: page.locator("span") });

    await spendableAssetList.waitFor({ state: "attached", timeout: 30_000 });

    const isSpendableAssetVisible = await spendableAssetList.isVisible().catch(() => false);
    if (!isSpendableAssetVisible) {
        throw Error(`Make sure "${args.chain}" is activated.`);
    }

    const allSpendableAssets = await spendableAssetList.locator("div").all();
    expect(allSpendableAssets.length).toBeGreaterThan(0);

    const copyWalletAddressContainer = page.locator(`div:has(div:has-text('${args.walletName}'))`).nth(-3);
    const copyWalletAddressPopover = copyWalletAddressContainer.locator("div:has(> div > svg)");
    await copyWalletAddressPopover.click();

    const popoverContainer = page.locator("div:has(> div[data-simplebar='init'])").last();
    const popoverSearchContainer = popoverContainer.locator("div:has(> div > input)");
    const popoverSearchInput = popoverSearchContainer.locator("input");
    await popoverSearchInput.fill(args.chain);

    const _chains = popoverContainer.locator("div[cursor='pointer']", { hasText: args.chain });
    await expect(_chains.first()).toBeVisible({ timeout: 60_000 });
    const chains = await _chains.all();

    let addressElement: Locator | undefined;

    for (const chain of chains) {
        let chainTag: string | undefined;
        if ("chainTag" in args) chainTag = args.chainTag;

        const chainElement = chain.locator(`div`, { hasText: args.chain }).last();
        const chainTagElement = chainTag ? chain.locator("div", { hasText: chainTag }).last() : null;

        const isChainTagElementVisible = chainTagElement
            ? await chainTagElement?.isVisible().catch(() => false)
            : false;
        const chainTagTextContent = isChainTagElementVisible ? await chainTagElement?.textContent() : null;
        const chainTextContent = await chainElement.textContent();

        const combinedChainText = chainTagTextContent ? `${chainTextContent} ${chainTagTextContent}` : chainTextContent;
        const combinedParsedData = chainTag ? `${args.chain} ${chainTag}` : args.chain;

        if (combinedChainText === combinedParsedData) {
            // Traversing up the DOM to find the address parent element
            const parentChainElement = chainElement.locator("xpath=../../../..");
            addressElement = parentChainElement;
            break;
        }
    }

    if (!addressElement) {
        throw Error(`Address for ${args.walletName} account on "${args.chain}" chain not found.`);
    }

    // To get the address, we need to hover over the chain element and click on it.
    // using click() alone will not work. We need to hover first.
    await addressElement.hover();
    await addressElement.scrollIntoViewIfNeeded();
    await addressElement.click();

    const accountAddress = await page.evaluate(async () => await navigator.clipboard.readText());
    expect(accountAddress).not.toBeFalsy();
    return accountAddress;
}
