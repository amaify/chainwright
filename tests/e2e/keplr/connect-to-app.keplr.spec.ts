import { expect } from "@playwright/test";
import { testDappFixture } from "@/tests/fixture/test-with-keplr-fixture";
import { connectWallet } from "./utils";

const test = testDappFixture;

test("Should connect wallet successfully", async ({ dappPage, keplr }) => {
    await connectWallet(dappPage, keplr);
    const appConnectedButton = dappPage.getByTestId("wallet-connected-button");
    await expect(appConnectedButton).toBeVisible();

    expect(dappPage).toBeTruthy();
});
