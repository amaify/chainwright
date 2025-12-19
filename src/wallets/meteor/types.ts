export type MeteorNetwork = "Mainnet" | "Testnet";

export type OnboardingArgs = {
    network: MeteorNetwork;
    privateKey: string;
    accountName: string;
    addWallet?: Array<AddAccountArgs>;
};

export type RenameAccountArgs = {
    newAccountName: string;
};

export type AddAccountArgs = {
    privateKey: string;
    accountName: string;
    network: MeteorNetwork;
};
