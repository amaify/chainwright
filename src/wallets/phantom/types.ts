export type OnboardingArgs =
    | {
          mode: "create";
          password: string;
      }
    | {
          mode: "recovery phrase";
          password: string;
          secretRecoveryPhrase: string;
      }
    | {
          mode: "private key";
          password: string;
          privateKey: string;
          accountName: string;
          chain: "Ethereum" | "Solana" | "Base" | "Sui" | "Bitcoin" | "Polygon" | "HyperEVM";
      };
