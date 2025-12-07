export function isAptosAddressValid(address: string) {
    return /^0x[0-9a-fA-F]{1,64}$/.test(address);
}
