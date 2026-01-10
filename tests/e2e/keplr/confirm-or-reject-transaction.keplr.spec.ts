import { testWithKeplrWorkerScope } from "@/tests/fixture/test-with-keplr-fixture";
import { fillForm } from "@/tests/utils/transaction-form";
import { connectWallet } from "./utils";

const test = testWithKeplrWorkerScope;

test.describe("Confirm and reject transaction E2E tests", () => {
    test("Should confirm transaction successfully", async ({ dappPage, keplr }) => {
        await connectWallet(dappPage, keplr);
        await fillForm({
            appPage: dappPage,
            walletAddress: "inj1v8pdxua5vfmcq9pt47pavgm9044ahasw8kyrxw",
            amount: "0.01",
        });
        await keplr.confirmTransaction();
    });

    test("Should reject transaction successfully", async ({ dappPage, keplr }) => {
        await connectWallet(dappPage, keplr);
        await fillForm({
            appPage: dappPage,
            walletAddress: "inj1v8pdxua5vfmcq9pt47pavgm9044ahasw8kyrxw",
            amount: "0.01",
        });
        await keplr.rejectTransaction();
    });
});
