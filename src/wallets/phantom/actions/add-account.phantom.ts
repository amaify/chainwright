import type { Page } from "@playwright/test";
import { menuSelectors } from "../selectors/homepage-selectors.phantom";
import { onboardingSelectors } from "../selectors/onboard-selectors.phantom";
import type { AddAccountArgs } from "../types";

type AddAccount = AddAccountArgs & { page: Page };

export async function addAccount({ page, privateKey, accountName, chain }: AddAccount) {
    const openMenuButton = page.getByTestId(menuSelectors.openMenuButton);
    await openMenuButton.click();

    const addAccountButton = page.getByTestId(menuSelectors.addAccountButton);
    await addAccountButton.click();

    const importPrivateKeyButton = page.locator(onboardingSelectors.importPrivateKeyButton);
    await importPrivateKeyButton.click();

    const listBoxMenu = page.locator("span[id='button--listbox-input--1']");
    const listBoxMenuTitle = await listBoxMenu.textContent();

    const nameInput = page.locator("input[name='name']");
    const privateKeyInput = page.locator("textarea[name='privateKey']");

    if (listBoxMenuTitle !== chain) {
        await listBoxMenu.click();

        const menuList = page.locator("ul[id='listbox--listbox-input--1']");
        const menuListItem = menuList.locator(`li[data-label='${chain}']`);
        await menuListItem.click();
    }

    await nameInput.fill(accountName);
    await privateKeyInput.fill(privateKey);

    const importButton = page.locator("button:has-text('Import')");
    await importButton.click();
}
