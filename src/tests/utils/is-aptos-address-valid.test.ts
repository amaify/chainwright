import { describe, expect, it } from "vitest";
import { isAptosAddressValid } from "./is-aptos-address-valid";

describe("Is APTOS Address valid", () => {
    it("Should validate a valid Aptos address", () => {
        const address = "0x3da19de50d6917fb0a8faa57137b31f7c854760e3c63d5953beb5efd725c2ad6";
        expect(isAptosAddressValid(address)).toBe(true);
    });

    it("Should be false if the address is invalid", () => {
        const address = "0x223";
        expect(isAptosAddressValid(address)).toBe(false);
    });
});
