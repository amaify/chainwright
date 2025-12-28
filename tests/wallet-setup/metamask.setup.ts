import defineWalletSetup from "@/core/define-wallet-setup";
import { Metamask } from "@/wallets/metamask/metamask";

const PASSWORD = "test1234";

export default defineWalletSetup(PASSWORD, async ({ walletPage }) => {
    const metamask = new Metamask(walletPage);
    const seedPhrase = "debris dress width prepare table repair index athlete divide avoid month member";

    await metamask.onboard({
        mode: "import",
        secretRecoveryPhrase: seedPhrase,
        mainAccountName: "Main test",
    });
});
