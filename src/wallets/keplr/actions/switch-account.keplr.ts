import type { Page } from "@playwright/test";
import type { SwitchAccountArgs } from "../types";

type SwitchAccount = SwitchAccountArgs & { page: Page };

export async function switchAccount({ page, accountToSwitchTo, currentAccountName }: SwitchAccount) {
    const openWalletSelectorButton = page.locator(`div:has(div:has-text('${currentAccountName}'))`).last();

    const isOpenWalletSelectorButtonVisible = await openWalletSelectorButton.isVisible().catch(() => false);
    if (!isOpenWalletSelectorButtonVisible) {
        throw new Error(
            `Current account "${currentAccountName}" not found. Make sure the account is the currently selected account.`,
        );
    }

    const triggerTextContent = await openWalletSelectorButton.textContent();

    if (triggerTextContent === accountToSwitchTo) {
        console.info(`\n Already on ${accountToSwitchTo} account. No need to switch.`);
        return;
    }

    await openWalletSelectorButton.click();

    const walletSelector = page
        .locator("div[class='simplebar-content'] > div")
        .locator("> div", { hasText: accountToSwitchTo });

    const isWalletSelectorVisible = await walletSelector.isVisible().catch(() => false);
    if (!isWalletSelectorVisible) {
        throw new Error(
            `Account "${accountToSwitchTo}" not found. Make sure the account is onboarded or verify the account name.`,
        );
    }

    await walletSelector.click();
}
