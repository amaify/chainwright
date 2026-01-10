import { testWithSolflareWorkerScope } from "@/tests/fixture/test-with-solflare-fixture";
import { fillForm } from "@/tests/utils/transaction-form";
import { connectWallet } from "./utils";

const test = testWithSolflareWorkerScope;

test.describe("Confirm transaction E2E tests", () => {
    test("Should confirm transaction successfully", async ({ dappPage, solflare }) => {
        await connectWallet(dappPage, solflare);
        await fillForm({
            appPage: dappPage,
            walletAddress: "2g5FgcaNpB7DRrcBCYrQQ72tpsAEZhDCPg8u6epb5zyQ",
            amount: "0.0001",
        });
        await solflare.confirmTransaction();
    });

    test("Should confirm transaction successfully if there is a simulation failed error/warning", async ({
        dappPage,
        solflare,
    }) => {
        await connectWallet(dappPage, solflare);
        await fillForm({
            appPage: dappPage,
            walletAddress: "2g5FgcaNpB7DRrcBCYrQQ72tpsAEZhDCPg8u6epb5zyQ",
            amount: "300",
        });
        await solflare.confirmTransaction();
    });
});
