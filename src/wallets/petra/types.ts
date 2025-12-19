export type OnboardingArgs =
    | {
          mode: "create";
          addWallet?: Array<AddAccount>;
      }
    | {
          mode: "importMnemonic";
          secretRecoveryPhrase: string;
          addWallet?: Array<AddAccount>;
      }
    | {
          mode: "importPrivateKey";
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
