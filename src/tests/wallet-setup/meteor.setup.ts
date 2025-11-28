import defineWalletSetup from "@/core/define-wallet-setup";

const PASSWORD = "test1234";

export default defineWalletSetup(PASSWORD, async ({ context, walletPage }) => {
    console.info("Setting up Meteor Wallet");
    return void 0;
});
