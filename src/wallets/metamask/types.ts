import z from "zod";

export type OnboardingArgs =
    | {
          mode: "create";
          password: string;
      }
    | {
          mode: "import";
          password: string;
          secretRecoveryPhrase: string;
      };

export type AddAccountArgs = {
    privateKey: string;
    accountName: string;
};

export const addCustomNetworkSchema = z.object({
    networkName: z.string().min(1, "Network name cannot be an empty string"),
    rpcUrl: z.url(),
    chainId: z.number().or(z.string().includes("0x")),
    currencySymbol: z.string().toUpperCase().min(1, "Currency symbol cannot be an empty string"),
});

export type AddCustomNetwork = z.infer<typeof addCustomNetworkSchema>;

export type SwitchNetwork =
    | {
          chainName: "Ethereum" | "Base" | "Linea";
          networkType: "mainnet";
      }
    | {
          chainName: "Sepolia" | "Linea Sepolia" | "Mega Testnet" | "Monad Testnet";
          networkType: "testnet";
      };
