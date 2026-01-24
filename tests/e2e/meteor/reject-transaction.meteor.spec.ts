import { testDappFixture } from "@/tests/fixture/test-with-meteor-fixture";
import { fillForm } from "@/tests/utils/transaction-form";
import { connectWallet } from "./utils";

const test = testDappFixture;

test("Should reject transaction successfully", async ({ dappPage, meteor }) => {
    await connectWallet(dappPage, meteor);
    await fillForm({
        appPage: dappPage,
        walletAddress: "0xc74921a7033a1f6bf764ec907e4e5d8fa4567726f3cfe6c9a1185b44689e26e6",
        amount: "0.00001",
    });
    await meteor.rejectTransaction();
});
