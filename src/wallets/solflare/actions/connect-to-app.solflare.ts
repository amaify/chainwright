import type { Page } from "@playwright/test";
import { switchAccount } from "./switch-account.solflare";

/**
 * By default, the last account will be selected. If you want to select a specific account, pass `account` parameter.
 */
export async function connectToApp(page: Page, account?: string) {
    if (account) {
        await switchAccount(page, account);
    }

    const connectButton = page.getByRole("button", { name: "Connect", exact: true });
    await connectButton.click();
}
