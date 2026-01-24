import type { Page } from "@playwright/test";
import { navigationMenuSelectors } from "../selectors/homepage-selectors.solflare";
import type { RenameAccountArgs } from "../types";

type RenameAccount = RenameAccountArgs & { page: Page };

export async function renameAccount({ page, currentAccountName, newAccountName }: RenameAccount) {
    const openWalletSelectorMenu = page.getByTestId(navigationMenuSelectors.walletSelectorButton);
    await openWalletSelectorMenu.click();

    const walletSelector = page.locator(`button[data-testid^='li-wallets']:has-text('${currentAccountName}')`);
    const isWalletSelectorVisible = await walletSelector.isVisible().catch(() => false);

    if (!isWalletSelectorVisible) {
        throw new Error(`Account "${currentAccountName}" not found. Make sure the account is available.`);
    }

    await walletSelector.hover();
    const walletSelectorMenu = walletSelector.getByTestId("icon-btn-three-dots");
    await walletSelectorMenu.click();

    const renameAccountButton = page.getByTestId("li-manage-wallet-rename-wallet");
    await renameAccountButton.click();

    const accountNameInput = page.getByTestId("input-name");
    await accountNameInput.clear();
    await accountNameInput.fill(newAccountName);

    const saveButton = page.getByTestId("btn-save");
    await saveButton.click();

    await renameAccountButton.waitFor({ state: "attached", timeout: 15_000 });
    const closeButton = page.getByTestId("icon-btn-close");
    await closeButton.click();
}
