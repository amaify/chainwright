import type { Page } from "@playwright/test";
import { addAccount } from "./actions/add-account.phantom";
import { confirmTransaction } from "./actions/confirm-transaction.phantom";
import { connectToApp } from "./actions/connect-to-app";
import { getAccountAddress } from "./actions/get-account-address.phantom";
import { lockWallet } from "./actions/lock.phantom";
import onboard from "./actions/onboard.phantom";
import { rejectTransaction } from "./actions/reject-transaction.phantom";
import { renameAccount } from "./actions/rename-account.phantom";
import { switchAccount } from "./actions/switch-account.phantom";
import { switchNetwork } from "./actions/switch-network.phantom";
import { toggleOptionalChain } from "./actions/toggle-optional-chain.phantom";
import { unlock } from "./actions/unlock.phantom";
import { PhantomProfile } from "./phantom-profile";
import type {
    AddAccountArgs,
    GetAccountAddress,
    OnboardingArgs,
    RenameAccountArgs,
    SwitchNetwork,
    ToggleOptionalChainArgs,
} from "./types";

export class Phantom extends PhantomProfile {
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
     * Switches the current account to the given account.
     * @param {string} accountName - The name of the account to switch to.
     * @example
     * const phantom = new phantom(page);
     * await phantom.switchAccount("Account 1");
     */
    async switchAccount(accountName: string) {
        await switchAccount(this.page, accountName);
    }

    /**
     * Retrieves the current account's address.
     * @param {string} accountName - The name of the account to switch to.
     * @returns A promise that resolves with the current account's address as a string.
     *
     * @example
     * const phantom = new Phantom(page);
     * const address = await phantom.getAccountAddress();
     */
    async getAccountAddress({ accountName, chain }: GetAccountAddress) {
        return await getAccountAddress({ page: this.page, accountName, chain });
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

    /**
     * Toggles the optional chains on or off.
     * @param {ToggleOptionalchainArgs} args - The arguments to toggle the optional chains.
     * @param {string} args.toggleMode - The mode of the optional chains. Can be either "on" or "off".
     * @param {string[]} args.supportedChains - The list of supported chains.
     * @example
     * const phantom = new Phantom(page);
     * await phantom.toggleOptionalChains({ supportedChains: ["Monad", "Bitcoin"], toggleMode: "off" });
     */
    async toggleOptionalChains({ toggleMode, supportedChains }: ToggleOptionalChainArgs) {
        await toggleOptionalChain({ page: this.page, supportedChains, toggleMode });
    }

    /**
     * Toggles the testnet network on or off.
     * @param {SwitchNetwork} args - The arguments to toggle the testnet network.
     * @param {string} args.mode - The mode of the testnet network. Can be either "on" or "off".
     * @param {string} args.chain - The name of the chain to toggle the testnet network for. Can be either "Solana" or "Ethereum".
     * @param {string} args.network - The name of the network to toggle the testnet network for. For example, "Solana Testnet".
     * @example
     * const phantom = new Phantom(page);
     * await phantom.switchNetwork({ mode: "on", chain: "Solana", network: "Solana Testnet" });
     */
    async switchNetwork({ ...args }: SwitchNetwork) {
        await switchNetwork({ page: this.page, ...args });
    }

    /**
     * Connects to an app by clicking on the "Connect to app" button.
     * If an account is provided, it will be selected before connecting to the app.
     * @param {string} [account] - The account to select before connecting to the app.
     * @example
     * const phantom = new Phantom(page);
     * await phantom.connectToApp("Account 1");
     */
    async connectToApp(account?: string) {
        await connectToApp(await this.promptPage(this.page.context()), account);
    }

    /**
     * Confirms a transaction in the wallet by clicking on the "Confirm" button.
     * @example
     * const phantom = new Phantom(page);
     * await phantom.confirmTransaction();
     */
    async confirmTransaction() {
        await confirmTransaction(await this.promptPage(this.page.context()));
    }

    /**
     * Rejects a transaction in the wallet by clicking on the "Reject" button.
     * @example
     * const phantom = new Phantom(page);
     * await phantom.rejectTransaction();
     */
    async rejectTransaction() {
        await rejectTransaction(await this.promptPage(this.page.context()));
    }
}
