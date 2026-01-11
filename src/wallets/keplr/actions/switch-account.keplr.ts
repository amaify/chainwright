import type { Page } from "@playwright/test";

export async function switchAccount(page: Page, account: string) {
    const openWalletSelectorButton = page.locator("div[color]").nth(1);
    const triggerTextContent = await openWalletSelectorButton.textContent();

    if (triggerTextContent === account) {
        console.info(`\n Already on ${account} account. No need to switch.`);
        return;
    }

    await openWalletSelectorButton.click();
    const walletSelector = page.locator("div[class='simplebar-content'] > div").locator("> div", { hasText: account });

    const isWalletSelectorVisible = await walletSelector.isVisible().catch(() => false);
    if (!isWalletSelectorVisible) {
        throw new Error(
            `Account "${account}" not found. Make sure the account is onboarded or verify the account name.`,
        );
    }

    await walletSelector.click();
}
