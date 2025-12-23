import defineWalletSetup from "@/core/define-wallet-setup";
import { Petra } from "@/wallets/petra/petra";

const PASSWORD = "PlayerPetra45!!";
const SECRET_PHRASE = "knife income industry useless speak inside scheme illegal stem route lab galaxy";

export default defineWalletSetup(PASSWORD, async ({ walletPage }) => {
    const petra = new Petra(walletPage);

    await petra.onboard({
        mode: "importMnemonic",
        accountName: "Default",
        secretRecoveryPhrase: SECRET_PHRASE,
        addWallet: [
            {
                accountName: "Echo",
                mode: "privateKey",
                privateKey: "ed25519-priv-0xe54b00b7e1288a869951b6a36bf11c0d6ffa9211fd8c94e164d3b7207563645f",
            },
        ],
    });
});
