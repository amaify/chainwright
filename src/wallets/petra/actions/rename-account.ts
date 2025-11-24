import { expect, type Page } from "@playwright/test";
import z from "zod";
import { accountSelectors, homepageSelectors } from "../selectors/homepage-selectors";

export type RenameAccount = {
    page: Page;
    newAccountName: string;
};

export async function renameAccount({ page, newAccountName }: RenameAccount) {
    const parsedNewAccountName = z.string().min(1, "Account name cannot be an empty string").parse(newAccountName);

    const settingsMenuButton = page.locator(homepageSelectors.settingsMenu);
    await settingsMenuButton.click();

    await expect(page.getByText("Settings").first()).toBeVisible();
    const editAccountButton = page.locator(accountSelectors.editAccountButton);
    await expect(editAccountButton).toBeVisible();
    await editAccountButton.click();

    await expect(page.getByText("Account name").first()).toBeVisible();
    const renameInput = page.locator(accountSelectors.renameAccountInput);

    const currentAccountName = await renameInput.getAttribute("value");

    if (currentAccountName === parsedNewAccountName) {
        throw Error(`The account to be renamed "${parsedNewAccountName}" already exists.`);
    }

    await renameInput.fill(parsedNewAccountName);

    const saveButton = page.locator(accountSelectors.saveButton);
    await expect(saveButton).toBeEnabled();
    await saveButton.click();

    await expect(page.getByText(parsedNewAccountName).first()).toBeVisible();
    const backButton = page.locator(homepageSelectors.backButton);
    await backButton.click();

    await expect(page.locator(homepageSelectors.depositButton)).toBeVisible();
    await expect(page.locator(homepageSelectors.sendButton)).toBeVisible();
}
