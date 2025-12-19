import z from "zod";

export type OnboardingArgs = {
    recoveryPhrase: string;
    network?: "Mainnet" | "Devnet" | "Testnet";
    addWallet?: Array<AddAccountArgs>;
};

export type SwitchNetwork = Omit<Required<OnboardingArgs>, "recoveryPhrase">["network"];

export const addAccountSchema = z.object({
    walletName: z.string().min(1, "Wallet name cannot be an empty string"),
    privateKey: z.array(z.number()).length(64),
});

export type AddAccountArgs = z.infer<typeof addAccountSchema>;

export type RenameAccountArgs = {
    currentAccountName: string;
    newAccountName: string;
};
