import { expect, type Page } from "@playwright/test";
import { accountSelectors, homepageSelectors } from "../selectors/homepage-selectors.petra";

export type RenameAccount = {
    page: Page;
    newAccountName: string;
};

export async function renameAccount({ page, newAccountName }: RenameAccount) {
    const settingsMenuButton = page.locator(homepageSelectors.settingsMenu);
    await settingsMenuButton.click();

    await expect(page.getByText("Settings").first()).toBeVisible();
    const editAccountButton = page.locator(accountSelectors.editAccountButton);
    await expect(editAccountButton).toBeVisible();
    await editAccountButton.click();

    await expect(page.getByText("Account name").first()).toBeVisible();
    const renameInput = page.locator(accountSelectors.renameAccountInput);

    const currentAccountName = await renameInput.getAttribute("value");

    if (currentAccountName === newAccountName) {
        throw Error(`The account to be renamed "${newAccountName}" already exists.`);
    }

    await renameInput.fill(newAccountName);

    const saveButton = page.locator(accountSelectors.saveButton);
    await expect(saveButton).toBeEnabled();
    await saveButton.click();

    await expect(page.getByText(newAccountName).first()).toBeVisible();
    const backButton = page.locator(homepageSelectors.backButton);
    await backButton.click();

    await Promise.allSettled([
        page.locator(homepageSelectors.depositButton).waitFor({ state: "visible", timeout: 20_000 }),
        page.locator(homepageSelectors.sendButton).waitFor({ state: "visible", timeout: 20_000 }),
    ]);
}
