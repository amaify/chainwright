export type OnboardingArgs =
    | {
          mode: "create";
      }
    | {
          mode: "recovery phrase";
          secretRecoveryPhrase: string;
      }
    | {
          mode: "private key";
          privateKey: string;
          accountName: string;
          chain: "Ethereum" | "Solana" | "Base" | "Sui" | "Bitcoin" | "Polygon" | "HyperEVM";
      };

export type RenameAccountArgs = {
    currentAccountName: string;
    newAccountName: string;
};

export type AddAccountArgs = {
    privateKey: string;
    accountName: string;
    chain: "Ethereum" | "Solana" | "Base" | "Sui" | "Bitcoin" | "Polygon" | "HyperEVM";
};

export type OptionalChains = "Ethereum" | "Monad" | "Base" | "Sui" | "Polygon" | "Bitcoin" | "Hyperevm";
export type ToggleOptionalChainMode = "on" | "off";

export type ToggleOptionalChainArgs = {
    supportedChains: Array<OptionalChains>;
    toggleMode: ToggleOptionalChainMode;
};

export type SwitchNetwork =
    | (
          | {
                mode: "on";
                chain: "Solana";
                network: "Solana Devnet" | "Solana Testnet" | "Solana Localnet";
            }
          | {
                mode: "on";
                chain: "Ethereum";
                network: "Ethereum Sepolia" | "Monad Testnet" | "Base Sepolia" | "Polygon Amoy" | "HyperEVM Testnet";
            }
      )
    | {
          mode: "off";
      };

export type GetAccountAddress = {
    accountName: string;
    chain: "Solana" | "Ethereum" | "Monad" | "Base" | "Sui" | "Polygon" | "Bitcoin" | "Hyperevm";
};
