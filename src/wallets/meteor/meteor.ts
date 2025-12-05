import type { Page } from "@playwright/test";
import { addAccount } from "./actions/add-account.meteor";
import { getAccountAddress } from "./actions/get-account-address.meteor";
import { lockWallet } from "./actions/lock.meteor";
import onboard from "./actions/onboard.meteor";
import { openSettings } from "./actions/open-settings.meteor";
import { renameAccount } from "./actions/rename-account.meteor";
import { switchAccount } from "./actions/switch-account.meteor";
import { switchNetwork } from "./actions/switch-network.meteor";
import { unlock } from "./actions/unlock.meteor";
import type { AddAccountArgs, MeteorNetwork, OnboardingArgs, RenameAccountArgs } from "./types";

export class Meteor {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Onboards the wallet.
     * This function onboards the wallet by entering the password and other required information.
     * @param {OnboardingArgs} args - The arguments required for onboarding.
     * @param args.password - The password for the wallet.
     * @param args.secretRecoveryPhrase - The secret recovery phrase for the wallet when importing a wallet.
     * @example
     * const meteor = new Meteor(page);
     * await meteor.onboard({ mode: "importPrivateKey", password: "password", privateKey: "private key" });
     */
    async onboard({ network, privateKey, accountName }: OnboardingArgs) {
        await onboard({ page: this.page, network, privateKey, accountName });
    }

    /**
     * Unlocks the wallet by entering the password.
     * @example
     * const meteor = new Meteor(page);
     * await meteor.unlock();
     */
    async unlock() {
        await unlock(this.page);
    }

    /**
     * Locks the wallet by entering the password.
     * This function locks the wallet by opening the settings page and then locking the wallet.
     * @example
     * const meteor = new Meteor(page);
     * await meteor.lock();
     */
    async lock() {
        await lockWallet(this.page);
    }

    /**
     * Renames an account in the wallet.
     * @param {Omit<RenameAccount, "page">} args - The arguments to rename the account.
     * @param args.newAccountName - The new name of the account.
     * @example
     * const meteor = new Meteor(page);
     * await meteor.renameAccount({ newAccountName: "New Account Name" });
     */
    async renameAccount({ newAccountName }: RenameAccountArgs) {
        await renameAccount({ page: this.page, newAccountName });
    }

    /**
     * Switches the current network to the given network.
     * @param {SwitchNetwork} networkName - The name of the network to switch to.
     * @example
     * const meteor = new Meteor(page);
     * await meteor.switchNetwork("network name");
     */
    async switchNetwork(network: MeteorNetwork) {
        await switchNetwork(this.page, network);
    }

    /**
     * Switches the current account to the given account.
     * @param {string} accountName - The name of the account to switch to.
     * @example
     * const meteor = new meteor(page);
     * await meteor.switchAccount("Account 1");
     */
    async switchAccount(accountName: string) {
        await switchAccount(this.page, accountName);
    }

    /**
     * Retrieves the current account's address.
     * @returns A promise that resolves with the current account's address as a string.
     *
     * @example
     * const meteor = new Meteor(page);
     * const address = await meteor.getAccountAddress();
     */
    async getAccountAddress() {
        return await getAccountAddress(this.page);
    }

    /**
     * Adds an account to the wallet via a private key or mnemonic phrase.
     * @param {{ accountName, ...args }: AddAccount} - The arguments to add the account.
     * @param {string} args.accountName - The name of the account to add.
     * @param {string} args.privateKey - The private key of the account to add, if the mode is "privateKey".
     * @param {string[]} args.mnemonicPhrase - The mnemonic phrase of the account to add, if the mode is "mnemonic".
     * @example
     * const meteor = new Meteor(page);
     * await meteor.addAccount(TBD);
     */
    async addAccount({ accountName, network, privateKey }: AddAccountArgs) {
        await addAccount({ page: this.page, accountName, network, privateKey });
    }

    /**
     * Opens the settings page for the wallet.
     * @example
     * const meteor = new Meteor(page);
     * await meteor.openSettings();
     */
    async openSettings() {
        await openSettings(this.page);
    }
}
