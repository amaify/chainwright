import type { BrowserContext, Page } from "playwright-core";
import { createWalletSetupHash } from "./create-hash";

type Args = {
    context: BrowserContext;
    walletPage: Page;
};
type WalletSetupFunction = ({ context, walletPage }: Args) => Promise<void>;

export default async function defineWalletSetup(fn: WalletSetupFunction) {
    const hash = createWalletSetupHash(fn.toString());

    return { fn, hash };
}
