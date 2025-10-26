import { METAMASK_DOWNLOAD_URL, SOLFLARE_DOWNLOAD_URL, type SupportedWallets } from "./constants";
import { prepareWalletExtension } from "./prepare-wallet-extension";

type Args = {
    walletName: SupportedWallets;
    walletHash: string;
};

const SUPPORTED_WALLETS: Record<SupportedWallets, string> = {
    metamask: METAMASK_DOWNLOAD_URL,
    solflare: SOLFLARE_DOWNLOAD_URL,
};

export async function triggerCacheCreation({ walletName, walletHash }: Args) {
    const extensionPath = await prepareWalletExtension({
        downloadUrl: SUPPORTED_WALLETS[walletName],
        name: walletName,
        walletHash,
    });

    console.log(extensionPath);
}
