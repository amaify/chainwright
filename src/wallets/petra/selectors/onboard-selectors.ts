export const onboardSelectors = {
    createWalletButton: "button:has-text('Create an account')",
    createSeedPhraseButton: "button:has-text('Create a seed phrase wallet')",
    createNewPasswordInput: "input[name='password']",
    confirmNewPasswordInput: "input[name='confirmPassword']",
    confirmPasswordCheckbox: "label>div[data-scope='checkbox']",
    continueButton: "button:has-text('Continue')",
    skipCopyRecoveryPhraseButton: "button:has-text('Skip')",
    getStartedButton: "button:has-text('Get started')",
    onboardingCompleteText: "h1:has-text('Your wallet is ready, you may close this window')",

    // Via Secret Recovery Phrase
    importWalletButton: "button:has-text('Import an account')",
    importUsingPrivateKeyButton: "button:has-text('Import private key')",
    importUsingMnemonicButton: "button:has-text('Import mnemonic')",
    importButton: "button:has-text('Import')",
    privateKeyInput: "input[name='privateKey']",
};
