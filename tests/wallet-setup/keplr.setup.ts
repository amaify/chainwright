import defineWalletSetup from "@/core/define-wallet-setup";
import { Keplr } from "@/wallets/keplr";

const PASSWORD = "test1234";
const PK = "ac0094c5fd64507228fb51a8ab32d98da78b3c480b4448ef6b08ecbe80cd83a2";
const PK_TWO = "e9506af695f223f9703e459931b6358760e8dc39da7718cbfcd024fa2ccc71d4";

export default defineWalletSetup(PASSWORD, async ({ walletPage }) => {
    const keplr = new Keplr(walletPage);

    await keplr.onboard([
        {
            chains: ["Injective", "Injective (Testnet)"],
            privateKey: PK,
            walletName: "Default",
        },
        {
            chains: ["Injective", "Injective (Testnet)"],
            privateKey: PK_TWO,
            walletName: "Nino",
        },
    ]);
});
