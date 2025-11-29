export type OnboardingArgs = {
    network: "Mainnet" | "Testnet";
    privateKey: string;
    password: string;
};

export type RenameAccountArgs = {
    newAccountName: string;
};
