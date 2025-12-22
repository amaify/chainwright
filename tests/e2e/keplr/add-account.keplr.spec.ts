import { expect } from "@playwright/test";
import { keplrWorkerScopeFixture } from "@/wallets/keplr/keplr-worker-scope-fixture";

const test = keplrWorkerScopeFixture();

test("Should add an account successfully", async ({ keplr, keplrPage }) => {
    await keplr.addAccount({
        chains: ["Injective", "Injective (Testnet)"],
        privateKey: "e9506af695f223f9703e459931b6358760e8dc39da7718cbfcd024fa2ccc71d4",
        walletName: "Kopi",
        mode: "add-account-single",
    });

    await expect(keplrPage.getByText("Kopi")).toBeVisible({ timeout: 15_000 });
});
