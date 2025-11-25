import type { Page } from "@playwright/test";
import { addAccount } from "./actions/add-account";
import { getAccountAddress } from "./actions/get-account-address";
import { lockWallet } from "./actions/lock";
import onboard from "./actions/onboard";
import { renameAccount } from "./actions/rename-account";
import { switchAccount } from "./actions/switch-account";
import { switchNetwork } from "./actions/switch-network";
import { toggleOptionalChain } from "./actions/toggle-optional-chain";
import { unlock } from "./actions/unlock";
import type { AddAccountArgs, OnboardingArgs, RenameAccountArgs, ToggleOptionalChainArgs } from "./types";

export class Phantom {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Onboards the wallet.
     * This function onboards the wallet by entering the password and other required information.
     * @param {OnboardingArgs} args - The arguments required for onboarding.
     * @param args.mode - Create a new wallet or import via private key / mnemonic.
     * @param args.password - The password for the wallet.
     * @param args.secretRecoveryPhrase - The secret recovery phrase for the wallet when importing a wallet.
     * @example
     * const phantom = new Phantom(page);
     * await phantom.onboard({ mode: "importPrivateKey", password: "password", privateKey: "private key" });
     */
    async onboard({ ...args }: OnboardingArgs) {
        await onboard({ page: this.page, ...args });
    }

    /**
     * Unlocks the wallet by entering the password.
     * @example
     * const phantom = new Phantom(page);
     * await phantom.unlock();
     */
    async unlock() {
        await unlock(this.page);
    }

    /**
     * Locks the wallet by entering the password.
     * This function locks the wallet by opening the settings page and then locking the wallet.
     * @example
     * const phantom = new Phantom(page);
     * await phantom.lock();
     */
    async lock() {
        await lockWallet(this.page);
    }

    /**
     * Renames an account in the wallet.
     * @param {RenameAccountArgs} args - The arguments to rename the account.
     * @param args.currentName - The current name of the active account.
     * @param args.newAccountName - The new name of the account.
     * @example
     * const phantom = new Phantom(page);
     * await phantom.renameAccount({ newAccountName: "New Account Name", currentAccountName: "Account 1" });
     */
    async renameAccount({ ...args }: RenameAccountArgs) {
        await renameAccount({ page: this.page, ...args });
    }

    /**
     * Switches the current network to the given network.
     * @param {SwitchNetwork} networkName - The name of the network to switch to.
     * @example
     * const phantom = new Phantom(page);
     * await phantom.switchNetwork("network name");
     */
    async switchNetwork() {
        await switchNetwork(this.page);
    }

    /**
     * Switches the current account to the given account.
     * @param {string} accountName - The name of the account to switch to.
     * @example
     * const phantom = new phantom(page);
     * await phantom.switchAccount("Account 1");
     */
    async switchAccount() {
        await switchAccount(this.page);
    }

    /**
     * Retrieves the current account's address.
     * @returns A promise that resolves with the current account's address as a string.
     *
     * @example
     * const phantom = new Phantom(page);
     * const address = await phantom.getAccountAddress();
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
     * const phantom = new Phantom(page);
     * await phantom.addAccount(TBD);
     */
    async addAccount({ ...args }: AddAccountArgs) {
        await addAccount({ page: this.page, ...args });
    }

    async toggleOptionalChains({ toggleMode, supportedChains }: ToggleOptionalChainArgs) {
        await toggleOptionalChain({ page: this.page, supportedChains, toggleMode });
    }
}
