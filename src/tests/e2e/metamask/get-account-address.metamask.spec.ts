import { expect } from "@playwright/test";
import { testWithMetamaskFixture } from "@/tests/fixture/test-with-metamask-fixture";
import { isEVMAddressValid } from "@/tests/utils/is-evm-address-valid";

const test = testWithMetamaskFixture;

test.describe("Get account address E2E tests", () => {
    test("Should get account address successfully", async ({ metamask }) => {
        const accountAddress = await metamask.getAccountAddress();

        // biome-ignore lint/style/noNonNullAssertion: nothing
        const isAddressValid = isEVMAddressValid(accountAddress!);

        expect(accountAddress).not.toBeNull();
        expect(isAddressValid).toBe(true);
    });
});
