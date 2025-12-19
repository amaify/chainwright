import defineWalletSetup from "@/core/define-wallet-setup";
import { Meteor } from "@/wallets/meteor";

const PASSWORD = "test1234";
const PRIVATE_KEY = "ed25519:53dYe8aG2tZzceRqFAtt5zbaDsTwNLNBVSkVwkJXRCYqXUMCUktgWzK3sF4Zem35naiLtwfYrn3upfynr1yqKEp3";
const PK_MAIN = "ed25519:mGMo7jVmHRUtoy88eKHatSQ2Em9pW75bPthTikyc9R5rLUGi7bEdxPwTTNdX5f83PPy3xc5cjbMpZHmnm62fK4J";
const PK_TWO = "ed25519:N46v79dASRWxD7fEVRkj1MC8HqR1jxmnkgUN8C1qwGXijeMG7aBF5QVJfaTCv2hf7HPumENNovm7i6752YLkqP9";

export default defineWalletSetup(
    PASSWORD,
    async ({ walletPage }) => {
        const meteor = new Meteor(walletPage);
        await meteor.onboard({
            network: "Testnet",
            privateKey: PRIVATE_KEY,
            accountName: "Default",
            addWallet: [
                {
                    accountName: "Alpha",
                    network: "Testnet",
                    privateKey: PK_TWO,
                },
                {
                    accountName: "Beta",
                    network: "Mainnet",
                    privateKey: PK_MAIN,
                },
            ],
        });
    },
    { profileName: "multiple-network" },
);
