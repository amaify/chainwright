import { expect, type Page } from "@playwright/test";
import { homepageSelectors } from "../selectors/homepage-selectors";

export type RenameAccount = {
    page: Page;
    oldAccountName: string;
    newAccountName: string;
};

export async function renameAccount({ page, oldAccountName, newAccountName }: RenameAccount) {
    const accountMenuButton = page.getByTestId(homepageSelectors.accountMenuButton);

    await expect(accountMenuButton).toBeVisible({ timeout: 60_000 });
    await accountMenuButton.click();
    await expect(page.getByRole("heading", { name: /accounts/i })).toBeVisible();

    const accountCells = page.getByTestId(`/^${homepageSelectors.accountCell}$/`);

    const allAccountCellsCount = await accountCells.count();

    console.log("Total account cells found:", allAccountCellsCount);
}
