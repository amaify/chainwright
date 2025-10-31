import type { BrowserContext, Page } from "playwright-core";

export type CLIOptions = "metamask" | "solflare" | "petra" | "phantom" | "all";
export type SupportedWallets = Exclude<CLIOptions, "all">;
export type ExtensionName = "Petra Aptos Wallet" | "MetaMask" | "Phantom" | "Solflare Wallet";

type Args = {
    context: BrowserContext;
    walletPage: Page;
};
export type WalletSetupFunction = ({ context, walletPage }: Args) => Promise<void>;
