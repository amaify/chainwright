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

type AddAndOnboardingArgs = {
    walletName: string;
    privateKey: string;
    chains: Array<KeplrChains>;
};

export type OnboardingArgs = Array<AddAndOnboardingArgs>;
export type AddAccountArgs = AddAndOnboardingArgs & { mode: "add-account-multiple" | "add-account-single" | "onboard" };

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

export const renameAccountSchema = z.object({
    currentAccountName: z.string().min(1, "Current account name cannot be an empty string"),
    newAccountName: z.string().min(1, "New account name cannot be an empty string"),
});

export type RenameAccountArgs = z.infer<typeof renameAccountSchema>;

export type SwitchAccountArgs = {
    accountToSwitchTo: string;
    currentAccountName: string;
};
