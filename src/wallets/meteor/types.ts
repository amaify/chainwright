export type MeteorNetwork = "Mainnet" | "Testnet";

export type OnboardingArgs = {
    network: MeteorNetwork;
    privateKey: string;
    password: string;
    accountName: string;
};

export type RenameAccountArgs = {
    newAccountName: string;
};

export type AddAccountArgs = {
    privateKey: string;
    accountName: string;
    network: MeteorNetwork;
};
