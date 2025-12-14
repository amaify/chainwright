import { expect } from "@playwright/test";
import { testWithsolflareFixture } from "@/tests/fixture/test-with-solflare-fixture";

const test = testWithsolflareFixture;

test("Should successfully get the user's address", async ({ solflare, solflarePage }) => {
    const ACCOUNT_ADDRESS = "54Fxigpofk3FkhNsaANj5M8RsSLDCBhQFYj4w7dQX8Gi";
    const address = await solflare.getAccountAddress();

    const toasContainer = solflarePage.getByTestId("toast-container");
    const toastMessage = toasContainer.locator("div[id='notistack-snackbar']");

    await expect(toastMessage).toHaveText("Copied to clipboard");
    expect(address).toBe(ACCOUNT_ADDRESS);
});
