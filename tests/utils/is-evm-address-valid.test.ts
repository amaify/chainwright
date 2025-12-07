import { describe, expect, it } from "vitest";
import { isEVMAddressValid } from "./is-evm-address-valid";

describe("Is EVM Address valid", () => {
    it("Should validate a valid EVM address", () => {
        const address = "0x153f45c04d5f24f39e0268fa589b8ec328191b3b";
        expect(isEVMAddressValid(address)).toBe(true);
    });

    it("Should be false if the address is invalid", () => {
        const address = "0x223";
        expect(isEVMAddressValid(address)).toBe(false);
    });
});
