import z from "zod";

const keplrChains = [
    "Injective",
    "Injective (Testnet)",
    "Polygon",
    "Bitcoin",
    "Bitcoin Signet",
    "Bitcoin Testnet",
] as const;

type KeplrChains = (typeof keplrChains)[number];
export type OnboardingArgs = {
    walletName: string;
    privateKey: string;
    chains: Array<KeplrChains>;
};

export const getAccountAddressSchema = z.discriminatedUnion("chain", [
    z.object({
        chain: z.literal(["Injective", "Injective (Testnet)", "Polygon"]),
        walletName: z.string().min(1, "Wallet name cannot be an empty string"),
    }),
    z.object({
        chain: z.literal(["Bitcoin", "Bitcoin Signet", "Bitcoin Testnet"]),
        chainTag: z.literal(["Taproot", "Native Segwit"]),
        walletName: z.string().min(1, "Wallet name cannot be an empty string"),
    }),
]);

export type GetAccountAddressArgs = z.infer<typeof getAccountAddressSchema>;
