import defineWalletSetup from "@/core/define-wallet-setup";
import { Metamask } from "@/wallets/metamask/metamask";

export default defineWalletSetup(async ({ walletPage }) => {
    const metamask = new Metamask(walletPage);

    await metamask.onboard({ mode: "create", password: "test1234" });

    return void 0;
});
