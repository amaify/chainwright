import { chromium } from "playwright-core";
import { METAMASK_DOWNLOAD_URL, SOLFLARE_DOWNLOAD_URL, type SupportedWallets } from "./constants";
import { prepareWalletExtension } from "./prepare-wallet-extension";
import { waitForExtensionOnLoadPage } from "./wait-for-extension-on-load-page";

type Args = {
    walletName: SupportedWallets;
    walletHash: string;
    force: boolean;
};

const SUPPORTED_WALLETS: Record<SupportedWallets, string> = {
    metamask: METAMASK_DOWNLOAD_URL,
    solflare: SOLFLARE_DOWNLOAD_URL,
};

export async function triggerCacheCreation({ walletName, walletHash, force }: Args) {
    const extensionPath = await prepareWalletExtension({
        downloadUrl: SUPPORTED_WALLETS[walletName],
        name: walletName,
        walletHash,
        force,
    });

    const browserArgs = [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`];

    const context = await chromium.launchPersistentContext(extensionPath, {
        headless: false,
        args: browserArgs,
    });

    await waitForExtensionOnLoadPage(context, walletName);
}
