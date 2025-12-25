import type { Page } from "@playwright/test";

type TransactionForm = {
    appPage: Page;
    walletAddress: string;
    amount: string;
};

export async function fillForm({ appPage, walletAddress, amount }: TransactionForm) {
    const addressInput = appPage.locator("input[id='address']").first();
    const amountInput = appPage.locator("input[id='amount']").first();
    const submitButton = appPage.getByRole("button", { name: "Submit", exact: true }).first();

    await addressInput.fill(walletAddress);
    await amountInput.fill(amount);
    await submitButton.click();
}
