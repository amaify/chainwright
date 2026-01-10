import type { Page } from "@playwright/test";
import { addAccount } from "./actions/add-account.{{walletName}}";
import { getAccountAddress } from "./actions/get-account-address.{{walletName}}";
import { lockWallet } from "./actions/lock.{{walletName}}";
import { onboard } from "./actions/onboard.{{walletName}}";
import { renameAccount } from "./actions/rename-account.{{walletName}}";
import { switchAccount } from "./actions/switch-account.{{walletName}}";
import { switchNetwork } from "./actions/switch-network.{{walletName}}";
import { unlock } from "./actions/unlock.{{walletName}}";
import { confirmTransaction } from "./actions/confirm-transaction.{{walletName}}"
import { rejectTransaction } from "./actions/reject-transaction.{{walletName}}"
import { connectToApp } from "./actions/connect-to-app.{{walletName}}"
import { {{WalletName}}Profile } from "./{{walletName}}-profile";

export class {{WalletName}} extends {{WalletName}}Profile {
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
     * const {{walletName}} = new {{WalletName}}(page);
     * await {{walletName}}.onboard({ mode: "importPrivateKey", password: "password", privateKey: "private key" });
     */
    async onboard() {
        await onboard(this.page)
    }

    /**
     * Unlocks the wallet by entering the password.
     * @example
     * const {{walletName}} = new {{WalletName}}(page);
     * await {{walletName}}.unlock();
     */
    async unlock() {
        await unlock(this.page);
    }

    /**
     * Locks the wallet by entering the password.
     * This function locks the wallet by opening the settings page and then locking the wallet.
     * @example
     * const {{walletName}} = new {{WalletName}}(page);
     * await {{walletName}}.lock();
     */
    async lock() {
        await lockWallet(this.page)
    }

    /**
     * Renames an account in the wallet.
     * @param {Omit<RenameAccount, "page">} args - The arguments to rename the account.
     * @param args.newAccountName - The new name of the account.
     * @example
     * const {{walletName}} = new {{WalletName}}(page);
     * await {{walletName}}.renameAccount({ newAccountName: "New Account Name" });
     */
    async renameAccount() {
        await renameAccount(this.page)
    }

    /**
     * Switches the current network to the given network.
     * @param {SwitchNetwork} networkName - The name of the network to switch to.
     * @example
     * const {{walletName}} = new {{WalletName}}(page);
     * await {{walletName}}.switchNetwork("network name");
     */
    async switchNetwork(networkName: SwitchNetwork) {
        await switchNetwork(this.page)
    }

    /**
     * Switches the current account to the given account.
     * @param {string} accountName - The name of the account to switch to.
     * @example
     * const {{walletName}} = new {{walletName}}(page);
     * await {{walletName}}.switchAccount("Account 1");
     */
    async switchAccount(accountName: string) {
        await switchAccount(this.page)
    }

    /**
     * Retrieves the current account's address.
     * @returns A promise that resolves with the current account's address as a string.
     *
     * @example
     * const {{walletName}} = new {{WalletName}}(page);
     * const address = await {{walletName}}.getAccountAddress();
     */
    async getAccountAddress() {
        return await getAccountAddress(this.page)
    }

    /**
     * Adds an account to the wallet via a private key or mnemonic phrase.
     * @param {{ accountName, ...args }: AddAccount} - The arguments to add the account.
     * @param {string} args.accountName - The name of the account to add.
     * @param {string} args.privateKey - The private key of the account to add, if the mode is "privateKey".
     * @param {string[]} args.mnemonicPhrase - The mnemonic phrase of the account to add, if the mode is "mnemonic".
     * @example
     * const {{walletName}} = new {{WalletName}}(page);
     * await {{walletName}}.addAccount(TBD);
     */
    async addAccount() {
        await addAccount(this.page)
    }

    /**
     * Connects to an app by clicking on the "Connect to app" button.
     * If an account is provided, it will be selected before connecting to the app.
     * @param {string} [account] - The account to select before connecting to the app.
     * @example
     * const metamask = new Metamask(page);
     * await metamask.connectToApp("Account 1");
     */
    async connectToApp(account?: string) {
        await connectToApp(await this.promptPage(this.page.context()), account);
    }

    /**
     * Confirms a transaction in the wallet by clicking on the "Confirm" button.
     * @example
     * const metamask = new Metamask(page);
     * await metamask.confirmTransaction();
     */
    async confirmTransaction(gasFee?: GasFeeSettings) {
        await confirmTransaction(await this.promptPage(this.page.context()), gasFee);
    }

    /**
     * Cancels a transaction in the wallet by clicking on the "Cancel" button.
     * @example
     * const metamask = new Metamask(page);
     * await metamask.cancelTransaction();
     */
    async rejectTransaction() {
        await rejectTransaction(await this.promptPage(this.page.context()));
    }
}
