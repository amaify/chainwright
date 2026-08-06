import type { SupportedWalletsMap } from "@/types";

export const CACHE_DIR_NAME = ".wallet-cache";
export const WALLET_CONTEXT_DIR_NAME = ".wallet-context";
export const WALLET_SETUP_DIR_NAME = "wallet-setup";

const METAMASK_VERSION = "13.33.0";

const ARCHIVED_WALLET_BASE_URL = `https://github.com/amaify/chainwright/releases/download/v0.1.0/`;
const METAMASK_WALLET_BASE_URL = `https://github.com/MetaMask/metamask-extension/releases/download/v${METAMASK_VERSION}/`;

export const METAMASK_DOWNLOAD_URL = `${METAMASK_WALLET_BASE_URL}metamask-chrome-${METAMASK_VERSION}.zip`;
export const SOLFLARE_DOWNLOAD_URL = `${ARCHIVED_WALLET_BASE_URL}solflare-wallet-extension-v2.19.1.zip`;
export const PETRA_DOWNLOAD_URL = `${ARCHIVED_WALLET_BASE_URL}petra-wallet-extension-v2.4.8.zip`;
export const PHANTOM_DOWNLOAD_URL = `${ARCHIVED_WALLET_BASE_URL}phantom-wallet-extension-v26.10.0.zip`;
export const METEOR_DOWNLOAD_URL = `${ARCHIVED_WALLET_BASE_URL}meteor-wallet-extension-v0.7.0.zip`;
export const KEPLR_DOWNLOAD_URL = `${ARCHIVED_WALLET_BASE_URL}keplr-wallet-extension-v0.13.39.zip`;

export const SUPPORTED_WALLETS: SupportedWalletsMap = {
    metamask: {
        downloadUrl: METAMASK_DOWNLOAD_URL,
        extensionName: "MetaMask",
        sha256: "400a71744b0f3a107e5fcb33871c25a50a8da96f9633df1b9bdef58b555441c1",
    },
    solflare: {
        downloadUrl: SOLFLARE_DOWNLOAD_URL,
        extensionName: "Solflare Wallet",
        sha256: "08c90d006638f719245250552bb942ddc8ec287c586da8624b771592faffbcf8",
    },
    petra: {
        downloadUrl: PETRA_DOWNLOAD_URL,
        extensionName: "Petra Aptos Wallet",
        sha256: "cb7c876e1b3e6e0f394c8ca446f99bac58a0e9da0411eda8d664b4a21956e53f",
    },
    phantom: {
        downloadUrl: PHANTOM_DOWNLOAD_URL,
        extensionName: "Phantom",
        sha256: "29d5475f4957d3fc888f9e69766c8ff96865c9572ac3021c9fd7c175cf97e955",
    },
    meteor: {
        downloadUrl: METEOR_DOWNLOAD_URL,
        extensionName: "Meteor Wallet",
        sha256: "133eed4119accd21fbae9dd9ed9e9228a83c3ebd783c6407d708c18c8e20ce05",
    },
    keplr: {
        downloadUrl: KEPLR_DOWNLOAD_URL,
        extensionName: "Keplr",
        sha256: "12182982784ac20c6741eaad036f4529d49dc4c222b0e6118e8647606e5a296f",
    },
};
