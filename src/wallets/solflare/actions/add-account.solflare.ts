import type { Page } from "@playwright/test";
import { navigationMenuSelectors } from "../selectors/homepage-selectors.solflare";
import { type AddAccountArgs, addAccountSchema } from "../types";

type AddAccount = AddAccountArgs & { page: Page };

export async function addAccount({ page, privateKey, walletName }: AddAccount) {
    const parsedArgs = addAccountSchema.parse({ privateKey, walletName });

    const openWalletSelectorMenu = page.getByTestId(navigationMenuSelectors.walletSelectorButton);
    await openWalletSelectorMenu.click();

    const addWalletButton = page.getByTestId("icon-btn-add");
    await addWalletButton.click();

    const importViaPrivateKeyButton = page.getByTestId("li-add-wallet-privateKey-add");
    await importViaPrivateKeyButton.click();

    const walletNameInput = page.getByTestId("input-name");
    const privateKeyInput = page.getByTestId("input-private-key");
    await walletNameInput.fill(parsedArgs.walletName);
    await privateKeyInput.fill(`${parsedArgs.privateKey}`);

    const importButton = page.getByTestId("btn-import");
    await importButton.click();

    const dialogContainer = page.getByRole("dialog");
    const closeButton = dialogContainer.getByTestId("icon-btn-close");
    await closeButton.click();

    // There are instances where the dialog doesn't close after clicking the close button.
    // To fix this, we check if the close button is still visible and click it if it is.
    const isCloseButtonStillVisible = await closeButton.isVisible().catch(() => false);
    if (isCloseButtonStillVisible) {
        await closeButton.click();
    }
}
