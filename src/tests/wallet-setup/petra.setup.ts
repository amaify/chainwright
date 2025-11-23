import defineWalletSetup from "@/core/define-wallet-setup";
import { Petra } from "@/wallets/petra/petra";

const PASSWORD = "PlayerPetra12@!";
const SECRET_PHRASE = "knife income industry useless speak inside scheme illegal stem route lab galaxy";

export default defineWalletSetup(PASSWORD, async ({ walletPage }) => {
    const petra = new Petra(walletPage);

    await petra.onboard({ mode: "importMnemonic", password: PASSWORD, secretRecoveryPhrase: SECRET_PHRASE });
    await petra.addAccount({
        accountName: "Echo",
        mode: "privateKey",
        privateKey: "ed25519-priv-0xe54b00b7e1288a869951b6a36bf11c0d6ffa9211fd8c94e164d3b7207563645f",
    });
    await petra.addAccount({
        accountName: "Tango",
        mode: "privateKey",
        privateKey: "ed25519-priv-0xd273e27a5f7ede39b8c2f4bde793fb949ecf5019007b5959b7683d5d53a1240f",
    });
    await petra.addAccount({
        accountName: "Mnemonic",
        mode: "mnemonic",
        mnemonicPhrase: "slam razor near morning edge across provide sting section bind soup differ",
    });
});
