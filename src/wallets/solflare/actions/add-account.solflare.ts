import type { Page } from "@playwright/test";
import { type AddAccountArgs, addAccountSchema } from "../types";

type AddAccount = AddAccountArgs & { page: Page };

export async function addAccount({ page, privateKey, walletName, mode }: AddAccount) {
    const parsedArgs = addAccountSchema.parse({ privateKey, walletName });

    if (mode !== "onboard") {
        const openWalletSelectorMenu = page.getByTestId("icon-section-wallet-picker-arrow-right");
        await openWalletSelectorMenu.click();
    }

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
}
