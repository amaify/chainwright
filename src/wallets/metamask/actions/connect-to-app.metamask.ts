import { expect, type Page } from "@playwright/test";
import { sleep } from "@/utils/sleep";
import { switchAccount } from "./switch-account.metamask";

/**
 * By default, the last account will be selected. If you want to select a specific account, pass `account` parameter.
 */
export async function connectToApp(page: Page, account?: string) {
    /**
     * Grant permission to all accounts in the wallet.
     * This is the first step so that we can easily switch to any desired account later.
     * With this approach, we can switch accounts during a test session.
     */
    const editAccountsButton = page.getByTestId("edit");
    await editAccountsButton.click();

    const allAccounts = await page.locator("div[data-testid^='multichain-account-cell-entropy']").all();
    for (const _account of allAccounts) {
        const label = _account.locator("label > span > span");
        const isLabelVisible = await label.isVisible().catch(() => false);
        if (!isLabelVisible) {
            await _account.click();
        }
    }

    const connectMoreAccountsButton = page.getByTestId("connect-more-accounts-button");
    await expect(connectMoreAccountsButton).toBeVisible();
    await connectMoreAccountsButton.click();

    if (account) {
        await switchAccount({ page, accountName: account });
    }

    const connectButton = page.getByRole("button", { name: "Connect", exact: true });
    await connectButton.click();

    // Wait for any popup to show
    await sleep(2_000);

    const noticeDialog = page.getByRole("dialog");
    const isNoticeDialogVisible = await noticeDialog.isVisible().catch(() => false);
    if (isNoticeDialogVisible) {
        const snapPrivacyScrollButton = page.getByTestId("snap-privacy-warning-scroll");
        const acceptButton = page.getByRole("button", { name: "Accept", exact: true });

        await snapPrivacyScrollButton.click();
        await snapPrivacyScrollButton.waitFor({ state: "detached", timeout: 30_000 });

        await expect(acceptButton).toBeEnabled();
        await acceptButton.click();
    }

    const confirmButton = page.getByRole("button", { name: "Confirm", exact: true });
    await expect(confirmButton).toBeEnabled();
    await confirmButton.click();
}
