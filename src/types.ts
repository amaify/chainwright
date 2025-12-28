import type { BrowserContext, Page } from "playwright-core";

export type CLIOptions = "metamask" | "solflare" | "petra" | "phantom" | "meteor" | "keplr" | "all";
export type SupportedWallets = Exclude<CLIOptions, "all">;
export type ExtensionName =
    | "Petra Aptos Wallet"
    | "MetaMask"
    | "Phantom"
    | "Keplr"
    | "Solflare Wallet"
    | "Meteor Wallet";

type Args = {
    context: BrowserContext;
    walletPage: Page;
};
export type WalletSetupFunction = ({ context, walletPage }: Args) => Promise<void>;

export type SupportedWalletsMap = {
    [key in SupportedWallets]: {
        downloadUrl: string;
        extensionName: ExtensionName;
    };
};

export type GetSetupFunctionFileList = {
    filePath: string;
    walletName: SupportedWallets;
};

export type WalletSetupConfig = {
    profileName?: string;
    slowMo?: number;
};

export type WorkerScopeFixtureArgs = {
    slowMo?: number;
    profileName?: string;
    dappUrl?: string;
};
