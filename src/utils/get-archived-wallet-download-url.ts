type WalletExtensionWithVersion = "petra-2.0.4" | "meteor-0.6.8" | "solflare-2.8.3";

export function getArchivedWalletDownloadUrl(walletExtension: WalletExtensionWithVersion) {
    return `https://github.com/TruFin-io/wallet-extension-archive/releases/download/v1.0.2/${walletExtension}.zip`;
}
