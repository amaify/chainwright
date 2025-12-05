export type OnboardingArgs =
    | {
          mode: "create";
      }
    | {
          mode: "importMnemonic";
          secretRecoveryPhrase: string;
      }
    | {
          mode: "importPrivateKey";
          privateKey: string;
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
