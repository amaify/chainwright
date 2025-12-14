import { expect } from "@playwright/test";
import { testWithsolflareFixture } from "@/tests/fixture/test-with-solflare-fixture";

const test = testWithsolflareFixture;

test.describe("Switch network E2E tests", () => {
    test("Should successfully switch network to Devnet", async ({ solflare, solflarePage }) => {
        await solflare.switchNetwork("Devnet");

        const toasContainer = solflarePage.getByTestId("toast-container");
        const toastMessage = toasContainer.locator("div[id='notistack-snackbar']");
        await expect(toastMessage).toHaveText(`Connected to Devnet`);
    });

    test("Should successfully switch network to Testnet", async ({ solflare, solflarePage }) => {
        await solflare.switchNetwork("Testnet");

        const toasContainer = solflarePage.getByTestId("toast-container");
        const toastMessage = toasContainer.locator("div[id='notistack-snackbar']");
        await expect(toastMessage).toHaveText(`Connected to Testnet`);
    });

    test("Should successfully switch network to Mainnet", async ({ solflare, solflarePage }) => {
        await solflare.switchNetwork("Devnet");

        const toasContainer = solflarePage.getByTestId("toast-container");
        const closeButton = toasContainer.getByTestId("icon-btn-toast-close");
        await closeButton.click();

        await solflare.switchNetwork("Mainnet");

        const toastMessage = toasContainer.locator("div[id='notistack-snackbar']");
        await expect(toastMessage).toHaveText(`Connected to Mainnet`);
    });

    test("Should not switch if the network is already active", async ({ solflare, solflarePage }) => {
        await solflare.switchNetwork("Mainnet");

        const header = solflarePage.getByTestId("section-header");
        await expect(header).toContainText("Portfolio");
    });
});
