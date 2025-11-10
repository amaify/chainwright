import defineWalletSetup from "@/core/define-wallet-setup";
import { Petra } from "@/wallets/petra/petra";

const PASSWORD = "PlayerPetra12@!";
// const PRIVATE_KEY = "ed25519-priv-0xe54b00b7e1288a869951b6a36bf11c0d6ffa9211fd8c94e164d3b7207563645f";
const SECRET_PHRASE = "knife income industry useless speak inside scheme illegal stem route lab galaxy";

export default defineWalletSetup(PASSWORD, async ({ walletPage }) => {
    const petra = new Petra(walletPage);

    try {
        await petra.onboard({ mode: "importMnemonic", password: PASSWORD, secretRecoveryPhrase: SECRET_PHRASE });
    } catch (error) {
        console.error("Error setting up Petra: ", (error as Error).message);
    }
});
