import { testDappFixture } from "@/tests/fixture/test-with-phantom-fixture";
import { connectWallet } from "./utils";

const test = testDappFixture;

test("Should connect wallet successfully", async ({ dappPage, phantom }) => {
    await connectWallet(dappPage, phantom);
});
