import { expect, type Page } from "@playwright/test";
import { switchAccount } from "./switch-account.metamask";

/**
 * By default, the last account will be selected. If you want to select a specific account, pass `account` parameter.
 */
export async function connectToApp(page: Page, account?: string) {
    if (account) {
        await switchAccount({ page, accountName: account });
    }

    const connectButton = page.getByRole("button", { name: "Connect", exact: true });
    await connectButton.click();
    await connectButton.waitFor({ state: "detached", timeout: 30_000 });

    const noticeDialog = page.getByRole("dialog");
    await noticeDialog.waitFor({ state: "attached", timeout: 30_000 });

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
