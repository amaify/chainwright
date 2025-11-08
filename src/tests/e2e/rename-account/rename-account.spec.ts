import { testWithMetamaskFixture } from "@/tests/fixture/test-with-metamask-fixture";
import { metamaskFixture } from "@/wallets/metamask/metamask-fixture";

const test = metamaskFixture();

test.describe("Rename account E2E tests", () => {
    test("Should rename account successfully", async ({ metamask }) => {
        await metamask.renameAccount({ oldAccountName: "Account 1", newAccountName: "Renamed Account" });
    });
});
