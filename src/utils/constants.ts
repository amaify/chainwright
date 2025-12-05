import type { SupportedWalletsMap } from "@/types";

export const CACHE_DIR_NAME = ".wallet-cache";
export const WALLET_SETUP_DIR_NAME = "wallet-setup";

const METAMASK_VERSION = "13.7.0";
const ARCHIVED_WALLET_BASE_URL = `https://github.com/amaify/playwright-kit-web3/releases/download/v0.1.0/`;

export const METAMASK_DOWNLOAD_URL = `https://github.com/MetaMask/metamask-extension/releases/download/v${METAMASK_VERSION}/metamask-chrome-${METAMASK_VERSION}.zip`;
export const SOLFLARE_DOWNLOAD_URL = `${ARCHIVED_WALLET_BASE_URL}solflare-wallet-extension-v2.13.0.zip`;
export const PETRA_DOWNLOAD_URL = `${ARCHIVED_WALLET_BASE_URL}petra-wallet-extension-v2.2.2.zip`;
export const PHANTOM_DOWNLOAD_URL = `${ARCHIVED_WALLET_BASE_URL}phantom-wallet-extension-v25.42.0.zip`;
export const METEOR_DOWNLOAD_URL = `${ARCHIVED_WALLET_BASE_URL}meteor-wallet-extension-v0.6.8.zip`;
export const KEPLR_DOWNLOAD_URL = `${ARCHIVED_WALLET_BASE_URL}keplr-wallet-extension-v0.12.296.zip`;

export const SUPPORTED_WALLETS: SupportedWalletsMap = {
    metamask: {
        downloadUrl: METAMASK_DOWNLOAD_URL,
        extensionName: "MetaMask",
    },
    solflare: {
        downloadUrl: SOLFLARE_DOWNLOAD_URL,
        extensionName: "Solflare Wallet",
    },
    petra: {
        downloadUrl: PETRA_DOWNLOAD_URL,
        extensionName: "Petra Aptos Wallet",
    },
    phantom: {
        downloadUrl: PHANTOM_DOWNLOAD_URL,
        extensionName: "Phantom",
    },
    meteor: {
        downloadUrl: METEOR_DOWNLOAD_URL,
        extensionName: "Meteor Wallet",
    },
    keplr: {
        downloadUrl: KEPLR_DOWNLOAD_URL,
        extensionName: "Keplr",
    },
};
