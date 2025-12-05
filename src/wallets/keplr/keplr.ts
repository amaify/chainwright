import type { Page } from "@playwright/test";
import { addAccount } from "./actions/add-account.keplr";
import { getAccountAddress } from "./actions/get-account-address.keplr";
import { lockWallet } from "./actions/lock.keplr";
import onboard from "./actions/onboard.keplr";
import { renameAccount } from "./actions/rename-account.keplr";
import { switchAccount } from "./actions/switch-account.keplr";
import { switchNetwork } from "./actions/switch-network.keplr";
import { unlock } from "./actions/unlock.keplr";
import type { OnboardingArgs } from "./types";

export class Keplr {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Onboards the wallet.
     * @param {OnboardingArgs} args - The arguments required for onboarding.
     * @param args.chain - The chain to onboard the wallet on.
     * @param args.privateKey - The private key of the wallet to onboard.
     * @param args.walletName - The name of the wallet to onboard.
     * @example
     * const keplr = new Keplr(page);
     * await keplr.onboard({ chain: "injective", privateKey: "private key", walletName: "Wallet Name" });
     */
    async onboard({ chains, privateKey, walletName }: OnboardingArgs) {
        await onboard({ page: this.page, privateKey, walletName, chains });
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
     * @param {Omit<RenameAccount, "page">} args - The arguments to rename the account.
     * @param args.newAccountName - The new name of the account.
     * @example
     * const keplr = new Keplr(page);
     * await keplr.renameAccount({ newAccountName: "New Account Name" });
     */
    async renameAccount() {
        await renameAccount(this.page);
    }

    /**
     * Switches the current network to the given network.
     * @param {SwitchNetwork} networkName - The name of the network to switch to.
     * @example
     * const keplr = new Keplr(page);
     * await keplr.switchNetwork("network name");
     */
    async switchNetwork() {
        await switchNetwork(this.page);
    }

    /**
     * Switches the current account to the given account.
     * @param {string} accountName - The name of the account to switch to.
     * @example
     * const keplr = new keplr(page);
     * await keplr.switchAccount("Account 1");
     */
    async switchAccount() {
        await switchAccount(this.page);
    }

    /**
     * Retrieves the current account's address.
     * @returns A promise that resolves with the current account's address as a string.
     *
     * @example
     * const keplr = new Keplr(page);
     * const address = await keplr.getAccountAddress();
     */
    async getAccountAddress() {
        await getAccountAddress(this.page);
    }

    /**
     * Adds an account to the wallet via a private key or mnemonic phrase.
     * @param {{ accountName, ...args }: AddAccount} - The arguments to add the account.
     * @param {string} args.accountName - The name of the account to add.
     * @param {string} args.privateKey - The private key of the account to add, if the mode is "privateKey".
     * @param {string[]} args.mnemonicPhrase - The mnemonic phrase of the account to add, if the mode is "mnemonic".
     * @example
     * const keplr = new Keplr(page);
     * await keplr.addAccount(TBD);
     */
    async addAccount() {
        await addAccount(this.page);
    }
}
