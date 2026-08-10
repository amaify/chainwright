import { expect, type Locator, type Page } from "@playwright/test";
import { skip } from "@/tests/utils/skip";
import { accountSelectors, homepageSelectors } from "../selectors/homepage-selectors.metamask";
import { onboardSelectors } from "../selectors/onboard-selectors.metamask";
import type { AddAccountArgs } from "../types";

type AddAccount = AddAccountArgs & {
    page: Page;
};

export async function addAccount({ page, privateKey, accountName }: AddAccount) {
    const accountMenuButton = page.getByTestId(homepageSelectors.accountMenuButton);

    await expect(accountMenuButton).toBeVisible({ timeout: 30_000 });
    await accountMenuButton.click();
    await expect(page.getByRole("heading", { name: /accounts/i })).toBeVisible();

    const addWalletButton = page.getByTestId(accountSelectors.addWalletButton);
    const startTextContent = await addWalletButton.textContent();

    if (startTextContent?.includes("Syncing")) {
        await expect
            .poll(async () => (await addWalletButton.textContent())?.trim() ?? "", { timeout: 120_000 })
            .not.toBe(startTextContent);
    }

    await expect(addWalletButton).toBeEnabled({ timeout: 60_000 });
    await addWalletButton.click();

    const addWalletModal = page.getByTestId("multichain-page");
    await expect(addWalletModal).toContainText(/add a wallet/i);

    const importAccountButton = page.getByTestId(accountSelectors.importAccountButton);
    await importAccountButton.click();

    const inputField = page.locator("input[id='private-key-box']");
    await inputField.fill(privateKey);

    const confirmButton = page.getByTestId(onboardSelectors.importAccountConfirmButton);
    await expect(confirmButton).toBeEnabled();
    await confirmButton.click();

    const importSRPError = page.getByTestId(onboardSelectors.importSRPError);
    const isErrorVisible = await importSRPError.isVisible().catch(() => false);

    if (isErrorVisible) {
        skip(isErrorVisible, `${(await importSRPError.textContent())?.split(".")[0]}`);
    }

    const _backButton = page.locator("button[aria-label='Back']").first();
    await _backButton.click();

    const activeAccount = page.locator("div[data-testid^='multichain-account-cell-keyring'][class*='is-selected']");

    const activeAccountName = await activeAccount
        .locator("p[class*='multichain-account-cell__account-name']")
        .textContent();

    if (activeAccountName) {
        await renameImportedAccount({
            page,
            accountName,
            activeAccountLocator: activeAccount,
            activeAccountName,
        });
    }

    const backButton = page.locator("button[aria-label='Back']").first();
    await backButton.click();
}

type RenameImportedAccount = {
    page: Page;
    accountName: string;
    activeAccountName: string;
    activeAccountLocator: Locator;
};

async function renameImportedAccount({
    page,
    accountName,
    activeAccountLocator,
    activeAccountName,
}: RenameImportedAccount) {
    const optionsButton = activeAccountLocator.locator(`div[aria-label='${activeAccountName} options']`);

    await expect(optionsButton).toBeVisible();
    await optionsButton.click();

    await expect(page.getByRole("tooltip")).toBeVisible();
    const renameOption = page.locator(`div[aria-label='${accountSelectors.renameAccountLabel}']`);
    await expect(renameOption).toBeVisible();
    await renameOption.click();

    const dialog = page.getByRole("dialog");
    const dialogTitle = dialog.getByRole("heading", { name: /rename/i });
    await expect(dialogTitle).toBeVisible();

    const inputField = dialog.getByRole("textbox");
    await expect(inputField).toBeVisible();
    await inputField.fill(accountName);

    const confirmButton = dialog.getByRole("button", { name: /confirm/i });
    await expect(confirmButton).toBeEnabled();
    await confirmButton.click();

    await dialog.waitFor({ state: "detached", timeout: 20_000 });

    const activeAccount = page.locator("div[data-testid^='multichain-account-cell-keyring'][class*='is-selected']");

    await expect(activeAccount).toContainText(accountName);
}
