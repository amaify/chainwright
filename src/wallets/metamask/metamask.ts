import type { Page } from "@playwright/test";
import { getPopupPageFromContext } from "@/utils/wallets/get-popup-page-from-context";
import { addAccount } from "./actions/add-account.metamask";
import { addCustomNetwork } from "./actions/add-custom-network.metamask";
import { connectToApp } from "./actions/connect-to-app.metamask";
import { getAccountAddress } from "./actions/get-account-address.metamask";
import { lockWallet } from "./actions/lock.metamask";
import onboard from "./actions/onboard.metamask";
import { openSettings } from "./actions/open-settings.metamask";
import { type RenameAccount, renameAccount } from "./actions/rename-account.metamask";
import { type SwitchAccount, switchAccount } from "./actions/switch-account.metamask";
import { switchNetwork } from "./actions/switch-network.metamask";
import { toggleShowTestnetNetwork } from "./actions/toggle-show-testnet-network";
import unlock from "./actions/unlock.metamask";
import { MetamaskProfile } from "./metamask-profile";
import type { AddAccountArgs, AddCustomNetwork, OnboardingArgs, SwitchNetwork } from "./types";

export class Metamask extends MetamaskProfile {
    page: Page;

    constructor(page: Page) {
        super();
        this.page = page;
    }

    /**
     * Onboards the wallet.
     * This function onboards the wallet by entering the password and other required information.
     * @param {OnboardingArgs} args - The arguments required for onboarding.
     * @param args.mode - Create a new wallet or import an existing wallet.
     * @param args.password - The password for the wallet.
     * @param args.secretRecoveryPhrase - The secret recovery phrase for the wallet when importing a wallet.
     * @example
     * const metamask = new Metamask(page);
     * await metamask.onboard({ mode: "import", password: "password", secretRecoveryPhrase: "Recovery phrase" });
     */
    async onboard(args: OnboardingArgs) {
        await onboard({ page: this.page, ...args });
    }

    /**
     * Unlocks the wallet.
     * This function unlocks the wallet by entering the password.
     * @example
     * const metamask = new Metamask(page);
     * await metamask.unlock()
     */
    async unlock() {
        await unlock(this.page);
    }

    /**
     * Locks the wallet.
     * This function opens the settings page and then locks the wallet.
     * @example
     * const metamask = new Metamask(page);
     * await metamask.lock()
     */
    async lock() {
        await openSettings(this.page);
        await lockWallet(this.page);
    }

    /**
     * Renames an account.
     * @param {Omit<RenameAccount, "page">} args - The arguments to rename the account.
     * @param args.newAccountName - The new name of the account.
     * @param args.currentAccountName - The current name of the account.
     * @example
     * const metamask = new Metamask(page);
     * await metamask.renameAccount({ newAccountName: "New Account Name", currentAccountName: "Current Account Name" });
     */
    async renameAccount({ newAccountName, currentAccountName }: Omit<RenameAccount, "page">) {
        await renameAccount({ page: this.page, newAccountName, currentAccountName });
    }

    /**
     * Adds an account to the wallet via a private key.
     * @param {AddAccountArgs} args - The arguments to add the account.
     * @param args.privateKey - The private key of the account to add.
     * @param args.accountName - The name of the account to add.
     * @example
     * const metamask = new Metamask(page);
     * await metamask.addAccount({ privateKey: "private key", accountName: "Account 1" });
     */
    async addAccount({ privateKey, accountName }: AddAccountArgs) {
        await addAccount({ page: this.page, privateKey, accountName });
    }

    /**
     * Switches the current account to the given account.
     * @param {Omit<SwitchAccount, "page">} args - The arguments to switch the account.
     * @param args.accountName - The name of the account to switch to.
     * @example
     * const metamask = new Metamask(page);
     * await metamask.switchAccount({ accountName: "Account 1" });
     */
    async switchAccount({ accountName }: Omit<SwitchAccount, "page">) {
        await switchAccount({ page: this.page, accountName });
    }

    /**
     * Switches the current network to the given network.
     * @param {SwitchNetwork} args - The arguments to switch the network.
     * @param args.networkType - It should be "testnet", "mainnet", and "custom".
     * @param args.chainName - (Mainnet): Ethereum, Base, Linea.
     * @param args.chainName - (Testnet): Sepolia, Linea Sepolia, Mega Testnet, Monad Testnet.
     * @example
     * const metamask = new Metamask(page);
     * await metamask.switchNetwork({chainName: "Sepolia", networkType: "testnet"});
     */
    async switchNetwork({ ...args }: SwitchNetwork) {
        await switchNetwork({ page: this.page, ...args });
    }

    /**
     * Gets the current account's address.
     * @returns The current account's address as a string.
     * @example
     * const metamask = new Metamask(page);
     * await metamask.getAccountAddress()
     */
    async getAccountAddress() {
        const address = await getAccountAddress(this.page);
        return address;
    }

    /**
     * Toggles the visibility of testnet networks in the wallet's network selector.
     * To persists the change, do it at the point of onboarding.
     * @example
     * const metamask = new Metamask(page);
     * await metamask.toggleShowTestnetNetwork()
     */
    async toggleShowTestnetNetwork() {
        await toggleShowTestnetNetwork({ page: this.page });
    }

    /**
     * Add a custom network to the wallet. If you want to persist the added wallet, do it at
     * the point of onboarding.
     * @param {AddCustomNetwork} options - an object containing the parameters for adding a custom network.
     * @param {number|string} options.chainId - the chain ID of the network.
     * @param {string} options.currencySymbol - the currency symbol of the network.
     * @param {string} options.networkName - the name of the network.
     * @param {string} options.rpcUrl - the RPC URL of the network.
     * @example
     * const metamask = new Metamask(page);
     * await metamask.addCustomNetwork({chainId: 100, currencySymbol: "XDAI", networkName: "Gnosis", rpcUrl: "https://gnosis.oat.farm"});
     */
    async addCustomNetwork({ chainId, currencySymbol, networkName, rpcUrl }: AddCustomNetwork) {
        await addCustomNetwork({ page: this.page, chainId, currencySymbol, networkName, rpcUrl });
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
        const popupUrl = await this.promptUrl();
        const popupPage = await getPopupPageFromContext(this.page.context(), popupUrl);
        await connectToApp(popupPage, account);
    }
}
