import { expect } from "@playwright/test";
import { testWithPetraFixture } from "@/tests/fixture/test-with-petra-fixture";
import { isAptosAddressValid } from "@/tests/utils/is-aptos-address-valid";

const test = testWithPetraFixture;

test("Should get account address successfully", async ({ petra }) => {
    const accountAddress = await petra.getAccountAddress();

    const isAddressValid = isAptosAddressValid(accountAddress);

    expect(accountAddress).not.toBeNull();
    expect(isAddressValid).toBe(true);
});
