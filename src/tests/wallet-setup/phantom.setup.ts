import defineWalletSetup from "@/core/define-wallet-setup";
import { Phantom } from "@/wallets/phantom";

const PASSWORD = "test1234";
// const RECOVERY_PHRASE = "buddy tape salad music public penalty abandon trade absent window buyer series";
// const PK = "2U1Q8ky5ayqEuoAq8uWntG2Fxrxj3B2irGHhBjH3zw3j75foYytCNSyZzbqcyLQDNKJeQE9YpeDVg319BfmJ8ktf";
const PK_ETH = "db8b55484c15a6caa975c300345afadda6d8dffac951175282fc8cf136a4d83a";

export default defineWalletSetup(PASSWORD, async ({ walletPage }) => {
    const phantom = new Phantom(walletPage);
    await phantom.onboard({
        mode: "private key",
        password: PASSWORD,
        privateKey: PK_ETH,
        accountName: "Hello world",
        chain: "Ethereum",
    });
});
