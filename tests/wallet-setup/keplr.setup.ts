import defineWalletSetup from "@/core/define-wallet-setup";
import { Keplr } from "@/wallets/keplr";

const PASSWORD = "test1234";
const PK = "ac0094c5fd64507228fb51a8ab32d98da78b3c480b4448ef6b08ecbe80cd83a2";

export default defineWalletSetup(PASSWORD, async ({ walletPage }) => {
    const keplr = new Keplr(walletPage);

    await keplr.onboard({
        chains: ["Injective", "Injective (Testnet)", "Bitcoin", "Bitcoin Signet", "Bitcoin Testnet", "Polygon"],
        privateKey: PK,
        walletName: "Default",
    });
});
