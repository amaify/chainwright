import defineWalletSetup from "@/core/define-wallet-setup";
import { Solflare } from "@/wallets/solflare";

const PASSWORD = "test1234"; // Update this password as needed.

export default defineWalletSetup(PASSWORD, async ({ walletPage }) => {
    const solflare = new Solflare(walletPage);

    const recoveryPhrase = "raven debate rug wink struggle garden pull divert seek wagon destroy rely";
    await solflare.onboard({ recoveryPhrase, network: "Mainnet" });

    const PRIVATE_KEY = [
        46, 95, 80, 248, 120, 23, 246, 78, 6, 150, 185, 220, 149, 145, 50, 19, 205, 73, 167, 160, 38, 61, 238, 114, 153,
        66, 125, 163, 35, 106, 188, 7, 166, 29, 137, 234, 146, 177, 72, 73, 130, 128, 44, 111, 134, 12, 77, 115, 187,
        131, 176, 224, 28, 178, 254, 180, 219, 10, 125, 170, 154, 243, 37, 201,
    ];
    await solflare.addAccount({ walletName: "Gamify", privateKey: PRIVATE_KEY, mode: "onboard" });
});
