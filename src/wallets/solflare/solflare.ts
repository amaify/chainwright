import type { Page } from "@playwright/test";
import { addAccount } from "./actions/add-account.solflare";
import { connectToApp } from "./actions/connect-to-app.solflare";
import { getAccountAddress } from "./actions/get-account-address.solflare";
import { lockWallet } from "./actions/lock.solflare";
import { onboard } from "./actions/onboard.solflare";
import { renameAccount } from "./actions/rename-account.solflare";
import { switchAccount } from "./actions/switch-account.solflare";
import { switchNetwork } from "./actions/switch-network.solflare";
import { unlock } from "./actions/unlock.solflare";
import { SolflareProfile } from "./solflare-profile";
import type { AddAccountArgs, OnboardingArgs, RenameAccountArgs, SwitchNetwork } from "./types";

export class Solflare extends SolflareProfile {
    page: Page;

    constructor(page: Page) {
        super();
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
     * const solflare = new Solflare(page);
     * await solflare.onboard({ mode: "importPrivateKey", password: "password", privateKey: "private key" });
     */
    async onboard({ recoveryPhrase, network, addWallet, walletName }: OnboardingArgs) {
        await onboard({ page: this.page, recoveryPhrase, network, addWallet, walletName });
    }

    /**
     * Unlocks the wallet by entering the password.
     * @example
     * const solflare = new Solflare(page);
     * await solflare.unlock();
     */
    async unlock() {
        await unlock(this.page);
    }

    /**
     * Locks the wallet by entering the password.
     * This function locks the wallet by opening the settings page and then locking the wallet.
     * @example
     * const solflare = new Solflare(page);
     * await solflare.lock();
     */
    async lock() {
        await lockWallet(this.page);
    }

    /**
     * Renames an account in the wallet.
     * @param {Omit<RenameAccount, "page">} args - The arguments to rename the account.
     * @param args.newAccountName - The new name of the account.
     * @example
     * const solflare = new Solflare(page);
     * await solflare.renameAccount({ newAccountName: "New Account Name" });
     */
    async renameAccount({ currentAccountName, newAccountName }: RenameAccountArgs) {
        await renameAccount({ page: this.page, currentAccountName, newAccountName });
    }

    /**
     * Switches the current network to the given network.
     * @param {SwitchNetwork} networkName - The name of the network to switch to.
     * @example
     * const solflare = new Solflare(page);
     * await solflare.switchNetwork("network name");
     */
    async switchNetwork(network: SwitchNetwork) {
        await switchNetwork(this.page, network);
    }

    /**
     * Switches the current account to the given account.
     * @param {string} accountName - The name of the account to switch to.
     * @example
     * const solflare = new solflare(page);
     * await solflare.switchAccount("Account 1");
     */
    async switchAccount(accountName: string) {
        await switchAccount(this.page, accountName);
    }

    /**
     * Retrieves the current account's address.
     * @returns A promise that resolves with the current account's address as a string.
     *
     * @example
     * const solflare = new Solflare(page);
     * const address = await solflare.getAccountAddress();
     */
    async getAccountAddress() {
        return await getAccountAddress(this.page);
    }

    /**
     * Adds an account to the wallet via a private key or mnemonic phrase.
     * @param {{ accountName, ...args }: AddAccount} - The arguments to add the account.
     * @param {string} args.walletName - The name of the account to add.
     * @param {string} args.privateKey - The private key of the account to add, if the mode is "privateKey".
     * @example
     * const solflare = new Solflare(page);
     * await solflare.addAccount({ walletName: "Gamify", privateKey: "private key"});
     */
    async addAccount({ privateKey, walletName }: AddAccountArgs) {
        await addAccount({ page: this.page, privateKey, walletName });
    }

    /**
     * Connects to an app by clicking on the "Connect to app" button.
     * If an account is provided, it will be selected before connecting to the app.
     * @param {string} [account] - The account to select before connecting to the app.
     * @example
     * const solflare = new Solflare(page);
     * await solflare.connectToApp("Account 1");
     */
    async connectToApp(account?: string) {
        await connectToApp(await this.promptPage(this.page.context()), account);
    }
}
