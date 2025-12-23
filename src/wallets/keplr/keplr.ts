import type { Page } from "@playwright/test";
import { addAccount } from "./actions/add-account.keplr";
import { connectToApp } from "./actions/connect-to-app.keplr";
import { getAccountAddress } from "./actions/get-account-address.keplr";
import { lockWallet } from "./actions/lock.keplr";
import onboard from "./actions/onboard.keplr";
import { renameAccount } from "./actions/rename-account.keplr";
import { switchAccount } from "./actions/switch-account.keplr";
import { unlock } from "./actions/unlock.keplr";
import { KeplrProfile } from "./keplr-profile";
import type {
    AddAccountArgs,
    GetAccountAddressArgs,
    OnboardingArgs,
    RenameAccountArgs,
    SwitchAccountArgs,
} from "./types";

export class Keplr extends KeplrProfile {
    page: Page;

    constructor(page: Page) {
        super();
        this.page = page;
    }

    /**
     * Onboards the wallet.
     * @param {OnboardingArgs} args - The arguments required for onboarding.
     * @param args[0].chains - The chains to onboard the wallet on.
     * @param args[0].privateKey - The private key of the wallet to onboard.
     * @param args[0].walletName - The name of the wallet to onboard.
     * @example
     * const keplr = new Keplr(page);
     * await keplr.onboard([
     *      {
     *          chains: ["Injective", "Injective (Testnet)"],
     *          privateKey: "private key",
     *          walletName: "Wallet Name"
     *      }
     * ]);
     */
    async onboard(args: OnboardingArgs) {
        await onboard({ page: this.page, onboard: args });
    }

    /**
     * Unlocks the wallet by entering the password.
     * @example
     * const keplr = new Keplr(page);
     * await keplr.unlock();
     */
    async unlock() {
        await unlock(this.page);
    }

    /**
     * Locks the wallet by entering the password.
     * This function locks the wallet by opening the settings page and then locking the wallet.
     * @example
     * const keplr = new Keplr(page);
     * await keplr.lock();
     */
    async lock() {
        await lockWallet(this.page);
    }

    /**
     * Renames an account in the wallet.
     * @param {RenameAccount} args - The arguments to rename the account.
     * @param args.currentName - The current name of the active account.
     * @param args.newAccountName - The new name of the account.
     * @example
     * const keplr = new Keplr(page);
     * await keplr.renameAccount({ newAccountName: "New Account Name" });
     */
    async renameAccount({ currentAccountName, newAccountName }: RenameAccountArgs) {
        await renameAccount({ page: this.page, currentAccountName, newAccountName });
    }

    /**
     * Switches the current account to the given account.
     * @param {SwitchAccountArgs} args - The name of the account to switch to.
     * @param args.accountToSwitchTo - The name of the account to switch to.
     * @param args.currentAccountName - The name of the current account.
     * @example
     * const keplr = new keplr(page);
     * await keplr.switchAccount({ accountToSwitchTo: "Account 1", currentAccountName: "Account 2" });
     */
    async switchAccount({ accountToSwitchTo, currentAccountName }: SwitchAccountArgs) {
        await switchAccount({ page: this.page, accountToSwitchTo, currentAccountName });
    }

    /**
     * Retrieves the current account's address.
     * @returns A promise that resolves with the current account's address as a string.
     *
     * @example
     * const keplr = new Keplr(page);
     * const address = await keplr.getAccountAddress();
     */
    async getAccountAddress({ ...args }: GetAccountAddressArgs) {
        return await getAccountAddress({ page: this.page, ...args });
    }

    /**
     * Adds an account to the wallet via a private key or mnemonic phrase.
     * @param {AddAccountArgs} args - The arguments to add the account.
     * @param args.chains - The chains of the account to add.
     * @param args.privateKey - The private key of the account to add, if the mode is "privateKey".
     * @param args.walletName - The name of the wallet to add the account to.
     * @param args.mode - The mode of adding the account (default: "add-account-multiple").
     * @example
     * const keplr = new Keplr(page);
     * await keplr.addAccount({ chains: ["Testnet"], privateKey: "private key", walletName: "Keplr Wallet", mode: "add-account-multiple" });
     */
    async addAccount({ chains, privateKey, walletName, mode = "add-account-multiple" }: AddAccountArgs) {
        await addAccount({ page: this.page, privateKey, walletName, chains, mode });
    }

    /**
     * Connects to the wallet.
     * This function connects to the wallet by opening the connect page and then clicking on the connect button.
     * @example
     * const keplr = new Keplr(page);
     * await keplr.connectToApp();
     */
    async connectToApp() {
        await connectToApp(await this.promptPage(this.page.context()));
    }
}
