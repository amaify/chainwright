import defineWalletSetup from "@/core/define-wallet-setup";
import { Solflare } from "@/wallets/solflare";

const PASSWORD = "test1234"; // Update this password as needed.

export default defineWalletSetup(PASSWORD, async ({ walletPage }) => {
    const solflare = new Solflare(walletPage);

    const recoveryPhrase = "raven debate rug wink struggle garden pull divert seek wagon destroy rely";
    await solflare.onboard({ recoveryPhrase, network: "Mainnet" });
});
