import type { Page } from "@playwright/test";
import { getPopupPageFromContext } from "@/utils/wallets/get-popup-page-from-context";
import { addAccount } from "./actions/add-account.petra";
import { connectToApp } from "./actions/connect-to-app.petra";
import { getAccountAddress } from "./actions/get-account-address.petra";
import { lockWallet } from "./actions/lock.petra";
import onboard from "./actions/onboard.petra";
import { type RenameAccount, renameAccount } from "./actions/rename-account.petra";
import { switchAccount } from "./actions/switch-account.petra";
import { switchNetwork } from "./actions/switch-network.petra";
import unlock from "./actions/unlock.petra";
import { PetraProfile } from "./petra-profile";
import type { AddAccount, OnboardingArgs, SwitchNetwork } from "./types";

export class Petra extends PetraProfile {
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
     * const petra = new Petra(page);
     * await petra.onboard({ mode: "importPrivateKey", password: "password", privateKey: "private key" });
     */
    async onboard(args: OnboardingArgs) {
        await onboard({ page: this.page, ...args });
    }

    /**
     * Unlocks the wallet by entering the password.
     * @example
     * const petra = new Petra(page);
     * await petra.unlock();
     */
    async unlock() {
        await unlock(this.page);
    }

    /**
     * Locks the wallet by entering the password.
     * This function locks the wallet by opening the settings page and then locking the wallet.
     * @example
     * const petra = new Petra(page);
     * await petra.lock();
     */
    async lock() {
        await lockWallet(this.page);
    }

    /**
     * Renames an account in the wallet.
     * @param {Omit<RenameAccount, "page">} args - The arguments to rename the account.
     * @param args.newAccountName - The new name of the account.
     * @example
     * const petra = new Petra(page);
     * await petra.renameAccount({ newAccountName: "New Account Name" });
     */
    async renameAccount({ newAccountName }: Omit<RenameAccount, "page">) {
        await renameAccount({ page: this.page, newAccountName });
    }

    /**
     * Switches the current network to the given network.
     * @param {SwitchNetwork} networkName - The name of the network to switch to.
     * @example
     * const petra = new Petra(page);
     * await petra.switchNetwork("Testnet");
     */
    async switchNetwork(networkName: SwitchNetwork) {
        await switchNetwork(this.page, networkName);
    }

    /**
     * Switches the current account to the given account.
     * @param {string} accountName - The name of the account to switch to.
     * @example
     * const petra = new Petra(page);
     * await petra.switchAccount("Account 1");
     */
    async switchAccount(accountName: string) {
        await switchAccount(this.page, accountName);
    }

    /**
     * Retrieves the current account's address.
     * @returns A promise that resolves with the current account's address as a string.
     *
     * @example
     * const petra = new Petra(page);
     * const address = await petra.getAccountAddress();
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
     * const petra = new Petra(page);
     * await petra.addAccount({ accountName: "Account 1", privateKey: "private key", mode: "privateKey" });
     */
    async addAccount({ accountName, ...args }: AddAccount) {
        await addAccount({ page: this.page, accountName, ...args });
    }

    /**
     * Connects to an app by clicking on the "Connect to app" button.
     * If an account is provided, it will be selected before connecting to the app.
     * @param {string} [account] - The account to select before connecting to the app.
     * @example
     * const petra = new Petra(page);
     * await petra.connectToApp("Account 1");
     */
    async connectToApp(account?: string) {
        const popupUrl = await this.promptUrl();
        const popupPage = await getPopupPageFromContext(this.page.context(), popupUrl);
        await connectToApp(popupPage, account);
    }
}
