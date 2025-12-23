export type OnboardingArgs =
    | {
          mode: "create";
          accountName: string;
          addWallet?: Array<AddAccount>;
      }
    | {
          mode: "importMnemonic";
          accountName: string;
          secretRecoveryPhrase: string;
          addWallet?: Array<AddAccount>;
      }
    | {
          mode: "importPrivateKey";
          accountName: string;
          privateKey: string;
          addWallet?: Array<AddAccount>;
      };

export type SwitchNetwork = "Mainnet" | "Testnet" | "Devnet" | "Shelbynet" | "Netna";

export type AddAccount =
    | {
          mode: "privateKey";
          accountName: string;
          privateKey: string;
      }
    | {
          mode: "mnemonic";
          accountName: string;
          mnemonicPhrase: string;
      };
