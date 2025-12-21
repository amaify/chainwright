import type { SupportedWallets } from "@/types";

/**
 * Core wallet interface
 */
export abstract class BaseWallet {
    abstract name: SupportedWallets;
    abstract onboardingPath: string;
    abstract indexUrl(): Promise<string>;
    abstract extensionId(): Promise<string>;
}
