import { testWithMetamaskFixture } from "@/tests/fixture/test-with-metamask-fixture";

const test = testWithMetamaskFixture;

test.describe("Rename account E2E tests", () => {
    test("Should rename account successfully", async ({ metamask }) => {
        await metamask.renameAccount({ oldAccountName: "Account 1", newAccountName: "Renamed Account" });
    });
});
