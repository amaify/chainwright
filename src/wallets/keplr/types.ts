import z from "zod";

const keplrChains = ["Injective", "Injective (Testnet)", "Polygon"] as const;

type KeplrChains = (typeof keplrChains)[number];
export type OnboardingArgs = {
    walletName: string;
    privateKey: string;
    chains: Array<KeplrChains>;
};

export const getAccountAddressSchema = z.object({
    chain: z.literal(keplrChains),
    walletName: z.string().min(1, "Wallet name cannot be an empty string"),
});
export type GetAccountAddressArgs = z.infer<typeof getAccountAddressSchema>;
