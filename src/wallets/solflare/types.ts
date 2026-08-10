import type { Page } from "@playwright/test";
import type { Solflare } from "./solflare";

export type OnboardingArgs = {
    recoveryPhrase: string;
    walletName?: string;
    network?: "Mainnet" | "Devnet" | "Testnet";
    additionalAccounts?: Array<AddAccountArgs>;
};

export type SwitchNetwork = Omit<Required<OnboardingArgs>, "recoveryPhrase">["network"];

export type AddAccountArgs = {
    walletName: string;
    privateKey: string;
};

export type RenameAccountArgs = {
    currentAccountName: string;
    newAccountName: string;
};

export type SolflareFixture = {
    contextPath: string;
    solflare: Solflare;
    solflarePage: Page;
    autoCloseNotification: undefined;
};
