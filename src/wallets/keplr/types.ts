import type { Page } from "@playwright/test";
import type { Keplr } from "./keplr";

const keplrChains = [
    "Injective",
    "Injective (Testnet)",
    "Polygon",
    "Bitcoin",
    "Bitcoin Signet",
    "Bitcoin Testnet",
] as const;

type KeplrChains = (typeof keplrChains)[number];

type AddAndOnboardingArgs =
    | {
          walletName: string;
          seedPhrase: string;
          mode: "seedPhrase";
          chains: Array<KeplrChains>;
      }
    | {
          walletName: string;
          privateKey: string;
          mode: "privateKey";
          chains: Array<KeplrChains>;
      };

export type OnboardingArgs = Array<AddAndOnboardingArgs>;

export type AddAccount = {
    walletName: string;
    chains: Array<KeplrChains>;
} & { mode: "add-account-multiple" | "add-account-single" | "onboard" };

export interface AddAccountViaPrivateKey extends AddAccount {
    privateKey: string;
}

export interface AddAccountViaSeedPhrase extends AddAccount {
    seedPhrase: string;
}

export type GetAccountAddressArgs =
    | {
          chain: "Injective" | "Injective (Testnet)" | "Polygon";
          walletName: string;
      }
    | {
          chain: "Bitcoin" | "Bitcoin Signet" | "Bitcoin Testnet";
          chainTag: "Taproot" | "Native Segwit";
          walletName: string;
      };

export type RenameAccountArgs = {
    currentAccountName: string;
    newAccountName: string;
};

export type KeplrFixture = {
    contextPath: string;
    keplr: Keplr;
    keplrPage: Page;
};
