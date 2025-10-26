import { getArchivedWalletDownloadUrl } from "./get-archived-wallet-download-url";

export type CLIOptions = "metamask" | "solflare" | "all";
export type SupportedWallets = Exclude<CLIOptions, "all">;

export const CACHE_DIR_NAME = ".wallet-cache";
export const WALLET_SETUP_DIR_NAME = "wallet-setup";

const METAMASK_VERSION = "12.23.0";
export const METAMASK_DOWNLOAD_URL = `https://github.com/MetaMask/metamask-extension/releases/download/v${METAMASK_VERSION}/metamask-chrome-${METAMASK_VERSION}.zip`;
export const SOLFLARE_DOWNLOAD_URL = getArchivedWalletDownloadUrl("solflare-2.8.3");
