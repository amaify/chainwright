import { testDappFixture } from "@/tests/fixture/test-with-keplr-fixture";
import { fillForm } from "@/tests/utils/transaction-form";

const test = testDappFixture;

test("Should reject transaction successfully", async ({ dappPage, keplr }) => {
    const connectWalletButton = dappPage.getByTestId("connect-wallet-button");
    await connectWalletButton.click();
    await keplr.connectToApp();

    await fillForm({
        appPage: dappPage,
        walletAddress: "inj1v8pdxua5vfmcq9pt47pavgm9044ahasw8kyrxw",
        amount: "0.01",
    });
    await keplr.rejectTransaction();
});
