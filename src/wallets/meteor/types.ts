export type OnboardingArgs = {
    network: "Mainnet" | "Testnet";
    privateKey: string;
    password: string;
    accountName: string;
};

export type RenameAccountArgs = {
    newAccountName: string;
};
