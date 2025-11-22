import defineWalletSetup from "@/core/define-wallet-setup";
import { Phantom } from "@/wallets/phantom";

const PASSWORD = "test1234";
// const RECOVERY_PHRASE = "buddy tape salad music public penalty abandon trade absent window buyer series";
const PK = "2U1Q8ky5ayqEuoAq8uWntG2Fxrxj3B2irGHhBjH3zw3j75foYytCNSyZzbqcyLQDNKJeQE9YpeDVg319BfmJ8ktf";

export default defineWalletSetup(PASSWORD, async ({ walletPage }) => {
    try {
        const phantom = new Phantom(walletPage);
        await phantom.onboard({
            mode: "private key",
            password: PASSWORD,
            privateKey: PK,
            accountName: "Hello world",
            chain: "Solana",
        });
    } catch (error) {
        console.error("Error setting up Phantom: ", (error as Error).message);
    }
});
