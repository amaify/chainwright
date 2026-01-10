import { testDappFixture } from "@/tests/fixture/test-with-solflare-fixture";
import { connectWallet } from "./utils";

const test = testDappFixture;

test("Should connect wallet successfully", async ({ dappPage, solflare }) => {
    await connectWallet(dappPage, solflare);
});
