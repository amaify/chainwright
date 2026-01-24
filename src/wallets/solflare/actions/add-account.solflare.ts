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

    const dialogTitle = page.locator("span:has-text('My wallets')");
    await dialogTitle.waitFor({ state: "attached" });

    const dialogContainer = page.getByRole("dialog");
    const closeButton = dialogContainer.getByTestId("icon-btn-close");
    await closeButton.click();
}
