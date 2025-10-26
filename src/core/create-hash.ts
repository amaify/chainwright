import { createHash } from "node:crypto";

export function createWalletSetupHash(walletSetupString: string) {
    return createHash("shake256", {
        outputLength: 10,
    })
        .update(walletSetupString)
        .digest("hex");
}
