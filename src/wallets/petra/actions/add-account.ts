import type { Page } from "@playwright/test";
import { accountSelectors } from "../selectors/homepage-selectors";
import { onboardSelectors } from "../selectors/onboard-selectors";
import type { AddAccount } from "../types";
import { renameAccount } from "./rename-account";

export async function addAccount({ page, accountName, mode, ...args }: AddAccount & { page: Page }) {
    const accountMenuButton = page.locator(accountSelectors.accountOptionsMenuButton).first();
    await accountMenuButton.click();

    const accountsDialog = page.getByRole("dialog");
    const addAccountButton = accountsDialog.locator(accountSelectors.addAccountButton);
    await addAccountButton.click();

    if (mode === "privateKey") {
        const privateKey = "privateKey" in args ? args.privateKey : "";

        const importWithPrivateKeyButton = page.locator(accountSelectors.addAccountWithPrivateKeyButton);
        await importWithPrivateKeyButton.click();

        const privateKeyInput = page.locator(onboardSelectors.privateKeyInput);
        await privateKeyInput.fill(privateKey);

        const importButton = page.locator(onboardSelectors.importButton);
        await importButton.click();

        await renameAccount({ page, newAccountName: accountName });
    }

    if (mode === "mnemonic") {
        const mnemonicPhrase = "mnemonicPhrase" in args ? args.mnemonicPhrase : "";
        const seedPhrase = mnemonicPhrase.split(" ");

        const importWithMnemonicPhraseButton = page.locator(accountSelectors.addAccountWithMnemonicButton);
        await importWithMnemonicPhraseButton.click();

        for (const [index, phrase] of seedPhrase.entries()) {
            const phraseInput = page.locator(
                `input[name="mnemonic-${String.fromCharCode("a".charCodeAt(0) + index)}"]`,
            );
            await phraseInput.fill(phrase);
        }

        const continueButton = page.locator(onboardSelectors.continueButton);
        await continueButton.click();

        await renameAccount({ page, newAccountName: accountName });
    }
}
