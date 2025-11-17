export type OnboardingArgs =
    | {
          mode: "create";
          password: string;
      }
    | {
          mode: "importMnemonic";
          password: string;
          secretRecoveryPhrase: string;
      }
    | {
          mode: "importPrivateKey";
          password: string;
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
