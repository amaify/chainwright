import defineWalletSetup from "@/core/define-wallet-setup";
import { Meteor } from "@/wallets/meteor";

const PASSWORD = "test1234";
const PRIVATE_KEY = "ed25519:53dYe8aG2tZzceRqFAtt5zbaDsTwNLNBVSkVwkJXRCYqXUMCUktgWzK3sF4Zem35naiLtwfYrn3upfynr1yqKEp3";
const PRIVATE_KEY_MAIN =
    "ed25519:mGMo7jVmHRUtoy88eKHatSQ2Em9pW75bPthTikyc9R5rLUGi7bEdxPwTTNdX5f83PPy3xc5cjbMpZHmnm62fK4J";
// const PK_TWO = "ed25519:3REEu998KGJxFmuKjNjJXNnePLYR8WbRrUxVCVw9CHx2W29oNT9kCdpHFbqHUnj8NRooKmVHp8eGiu8ATqRnhB2J";
// const PK_THREE = "ed25519:3FNToJLqbfkgpZy3YzkAKSZxV4MZ9uPi5EfgkeemM4ruz7W6pcrcEGDMoSxRQtc3T8hNcb6nPiMguprrbcvmGWp9";

// const ALL_ACCOUNTS = [{ accountName: "Alpha", privateKey: PRIVATE_KEY_MAIN, network: "Mainnet" }] as const;

export default defineWalletSetup(
    PASSWORD,
    async ({ walletPage }) => {
        const meteor = new Meteor(walletPage);
        await meteor.onboard({
            network: "Testnet",
            privateKey: PRIVATE_KEY,
            accountName: "Default",
        });

        await meteor.addAccount({
            accountName: "Alpha",
            network: "Mainnet",
            privateKey: PRIVATE_KEY_MAIN,
        });
    },
    { profileName: "multiple-network" },
);
