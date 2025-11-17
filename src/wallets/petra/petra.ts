import type { Page } from "playwright-core";
import { addAccount } from "./actions/add-account";
import { getAccountAddress } from "./actions/get-account-address";
import { lockWallet } from "./actions/lock";
import onboard from "./actions/onboard";
import { type RenameAccount, renameAccount } from "./actions/rename-account";
import { switchNetwork } from "./actions/switch-network";
import unlock from "./actions/unlock";
import type { AddAccount, OnboardingArgs, SwitchNetwork } from "./types";

export class Petra {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async onboard(args: OnboardingArgs) {
        await onboard({ page: this.page, ...args });
    }

    async unlock() {
        await unlock(this.page);
    }

    async lock() {
        await lockWallet(this.page);
    }

    async renameAccount({ newAccountName }: Omit<RenameAccount, "page">) {
        await renameAccount({ page: this.page, newAccountName });
    }

    async switchNetwork(networkName: SwitchNetwork) {
        await switchNetwork(this.page, networkName);
    }

    async getAccountAddress() {
        return await getAccountAddress(this.page);
    }

    async addAccount({ accountName, ...args }: AddAccount) {
        await addAccount({ page: this.page, accountName, ...args });
    }
}
