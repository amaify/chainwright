import type { Page } from "@playwright/test";
import { homepageSelectors } from "../selectors/homepage-selectors.meteor";
import type { RenameAccountArgs } from "../types";

type RenameAccount = RenameAccountArgs & { page: Page };

export async function renameAccount({ page, newAccountName }: RenameAccount) {
    const sidebarMenuButton = page.locator(homepageSelectors.openSidebarMenuButton);
    await sidebarMenuButton.click();

    const accountName = page.locator("div:has(> h2):has(> svg)");
    await accountName.click();

    const accountNameInput = page.locator("input[placeholder='Ex. My Meteor Wallet']");
    const updateButton = page.locator("button[type='submit']:has-text('Update')");
    await accountNameInput.fill(newAccountName);
    await updateButton.click();

    const closeMenuButton = page.locator("div[id='root'] button[aria-label='Close']");
    await closeMenuButton.click();
}
