import { testWithPhantomWorkerScope } from "@/tests/fixture/test-with-phantom-fixture";
import { fillForm } from "@/tests/utils/transaction-form";
import { connectWallet } from "./utils";

const test = testWithPhantomWorkerScope;

test.describe("Reject transaction E2E tests", () => {
    test("Should reject transaction successfully", async ({ dappPage, phantom }) => {
        await connectWallet(dappPage, phantom);
        await fillForm({
            appPage: dappPage,
            walletAddress: "2g5FgcaNpB7DRrcBCYrQQ72tpsAEZhDCPg8u6epb5zyQ",
            amount: "0.0001",
        });
        await phantom.rejectTransaction();
    });

    test("Should reject transaction successfully if there is a confirm anyway warning", async ({
        dappPage,
        phantom,
    }) => {
        await connectWallet(dappPage, phantom);
        await fillForm({
            appPage: dappPage,
            walletAddress: "2g5FgcaNpB7DRrcBCYrQQ72tpsAEZhDCPg8u6epb5zyQ",
            amount: "30",
        });
        await phantom.rejectTransaction();
    });
});
