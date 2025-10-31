import type { WalletSetupFunction } from "@/types";

export default async function defineWalletSetup(fn: WalletSetupFunction, walletProfile?: string) {
    return { fn, walletProfile };
}
