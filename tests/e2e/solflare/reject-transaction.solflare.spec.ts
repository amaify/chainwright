import { testDappFixture } from "@/tests/fixture/test-with-solflare-fixture";
import { fillForm } from "@/tests/utils/transaction-form";
import { connectWallet } from "./utils";

const test = testDappFixture;

test("Should reject transaction successfully", async ({ dappPage, solflare }) => {
    await connectWallet(dappPage, solflare);
    await fillForm({
        appPage: dappPage,
        walletAddress: "2g5FgcaNpB7DRrcBCYrQQ72tpsAEZhDCPg8u6epb5zyQ",
        amount: "0.0001",
    });
    await solflare.rejectTransaction();
});
