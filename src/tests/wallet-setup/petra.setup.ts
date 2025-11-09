import defineWalletSetup from "@/core/define-wallet-setup";
import { Petra } from "@/wallets/petra/petra";

const PASSWORD = "PlayerPetra12@!";
const PRIVATE_KEY = "ed25519-priv-0xd273e27a5f7ede39b8c2f4bde793fb949ecf5019007b5959b7683d5d53a1240f";

export default defineWalletSetup(PASSWORD, async ({ walletPage }) => {
    const petra = new Petra(walletPage);

    await petra.onboard({ mode: "importPrivateKey", password: PASSWORD, privateKey: PRIVATE_KEY });
});
