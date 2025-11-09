export type OnboardingArgs =
    | {
          mode: "create";
          password: string;
      }
    | {
          mode: "importMnemonic";
          password: string;
          secretRecoveryPhrase: string;
      }
    | {
          mode: "importPrivateKey";
          password: string;
          privateKey: string;
      };
