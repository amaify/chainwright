import type { Page } from "@playwright/test";

type TransactionForm = {
    appPage: Page;
    walletAddress: string;
    amount: string;
};

export async function fillForm({ appPage, walletAddress, amount }: TransactionForm) {
    const addressInput = appPage.locator("input[id='address']");
    const amountInput = appPage.locator("input[id='amount']");
    const submitButton = appPage.getByRole("button", { name: "Submit", exact: true });

    await addressInput.fill(walletAddress);
    await amountInput.fill(amount);
    await submitButton.click();
}
