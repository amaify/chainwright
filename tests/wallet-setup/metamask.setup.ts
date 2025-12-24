import defineWalletSetup from "@/core/define-wallet-setup";
import { Metamask } from "@/wallets/metamask/metamask";

const PASSWORD = "test1234";

export default defineWalletSetup(PASSWORD, async ({ walletPage }) => {
    const metamask = new Metamask(walletPage);
    const seedPhrase = "slam razor near morning edge across provide sting section bind soup differ";

    await metamask.onboard({
        mode: "import",
        secretRecoveryPhrase: seedPhrase,
        mainAccountName: "Testing account",
        addWallet: [
            {
                accountName: "Foxtrot",
                privateKey: "b9c9ceb96d93f77278ec4e4c50e84a90ee08f9279f360bfb7cf8c8a0396149fb",
            },
        ],
    });
});
