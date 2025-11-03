import type { WalletSetupConfig, WalletSetupFunction } from "@/types";

export default async function defineWalletSetup(fn: WalletSetupFunction, config: WalletSetupConfig = {}) {
    return { fn, config };
}
