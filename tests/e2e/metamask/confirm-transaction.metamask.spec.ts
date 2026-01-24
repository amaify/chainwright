import { expect, type Page } from "@playwright/test";
import { testWithMetamaskWorkerScope } from "@/tests/fixture/test-with-metamask-fixture";
import { fillForm } from "@/tests/utils/transaction-form";
import type { Metamask } from "@/wallets/metamask/metamask";

const test = testWithMetamaskWorkerScope;

async function _confirmTransaction(metamask: Metamask, dappPage: Page) {
    await metamask.switchAccount({ accountName: "Dapp" });

    const connectWalletButton = dappPage.getByTestId("connect-wallet-button");
    const isConnectWalletButtonVisible = await connectWalletButton.isVisible().catch(() => false);
    if (isConnectWalletButtonVisible) {
        await connectWalletButton.click();

        const dialog = dappPage.getByRole("dialog");
        await expect(dialog).toBeVisible();

        const connectMetamaskButton = dialog.getByRole("button", { name: "MetaMask" });
        await connectMetamaskButton.click();

        await metamask.connectToApp();
    }

    const appConnectedButton = dappPage.getByTestId("wallet-connected-button");
    await expect(appConnectedButton).toBeVisible();

    const ADDRESS = "0xa8dC5724e9e2dA6041Ec614138af7f6084589990";
    await fillForm({ appPage: dappPage, walletAddress: ADDRESS, amount: "0.00001" });
}

test.describe("E2E For Confirming transaction in Metamask wallet", () => {
    test("Should confirm transaction successfully", async ({ dappPage, metamask }) => {
        await _confirmTransaction(metamask, dappPage);
        await metamask.confirmTransaction();
    });

    test("Should confirm transaction with warning successfully", async ({ dappPage, metamask }) => {
        await metamask.switchAccount({ accountName: "Dapp" });

        const connectWalletButton = dappPage.getByTestId("connect-wallet-button");
        const isConnectWalletButtonVisible = await connectWalletButton.isVisible().catch(() => false);

        if (isConnectWalletButtonVisible) {
            await connectWalletButton.click();

            const dialog = dappPage.getByRole("dialog");
            await expect(dialog).toBeVisible();

            const connectMetamaskButton = dialog.getByRole("button", { name: "MetaMask" });
            await connectMetamaskButton.click();

            await metamask.connectToApp();
        }

        const ADDRESS = "0xa8dC5724e9e2dA6041Ec614138af7f6084589990";
        const ADDRESS_TWO = "0x0E72a5083F29a6bc727EcF0F2f88b4e6c0f55D94";

        const addressInput = dappPage.locator("input[name='firstAddress']").first();
        const addressInputTwo = dappPage.locator("input[name='secondAddress']").first();
        const amountInput = dappPage.locator("input[name='firstAmount']").first();
        const amountInputTwo = dappPage.locator("input[name='secondAmount']").first();
        const amountInputThree = dappPage.locator("input[name='thirdAmount']").first();
        const submitButton = dappPage.getByRole("button", { name: "Submit", exact: true }).last();

        await addressInput.fill(ADDRESS);
        await addressInputTwo.fill(ADDRESS_TWO);
        await amountInput.fill("0.00001");
        await amountInputTwo.fill("0.00002");
        await amountInputThree.fill("0.0001");
        await submitButton.click();

        await metamask.confirmTransaction();
    });

    test("Should confirm transaction with slow/medium/high/ gas fee option", async ({ dappPage, metamask }) => {
        await _confirmTransaction(metamask, dappPage);
        await metamask.confirmTransaction({ feeType: "low" });
    });

    test("Should confirm transaction with advanced(custom) gas fee option", async ({ dappPage, metamask }) => {
        await _confirmTransaction(metamask, dappPage);
        await metamask.confirmTransaction({ feeType: "advanced", maxBaseFee: "8", priorityFee: "0.5" });
    });
});
