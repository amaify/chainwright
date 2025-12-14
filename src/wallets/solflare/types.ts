import z from "zod";

export type OnboardingArgs = {
    recoveryPhrase: string;
    network?: "Mainnet" | "Devnet" | "Testnet";
};

export type SwitchNetwork = Omit<Required<OnboardingArgs>, "recoveryPhrase">["network"];

export const addAccountSchema = z.object({
    walletName: z.string().min(1, "Wallet name cannot be an empty string"),
    privateKey: z.array(z.number()).length(64),
    mode: z.optional(z.literal(["onboard", "import"])),
});

export type AddAccountArgs = z.infer<typeof addAccountSchema>;
