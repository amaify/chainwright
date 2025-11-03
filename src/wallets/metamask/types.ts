export type OnboardingArgs = {
    mode: "create" | "import";
    password: string;
    secretRecoveryPhrase?: string;
};
