export const homepageSelectors = {
    depositButton: "button:has-text('Deposit')",
    sendButton: "button:has-text('Send')",
    receiveButton: "button:has-text('Receive')",
    settingsMenu: "button[aria-label='Settings']",
    lockButton: "global-menu-lock",
    accountMenuButton: "button[data-part='trigger']",
    accountDialog: "div[role='dialog']",
    backButton: "button[id='back-button']",
};

export const settingsMenuSelectors = {
    networkSection: "a[href='/settings/network']",
    backButton: "button[id='back-button']",
};

export const unlockWalletSelectors = {
    passwordInput: "input[name='password']",
    unlockButton: "button:has-text('Unlock')",
};

export const accountSelectors = {
    accountOptionsMenuButton: "button[data-scope='popover']",
    editAccountButton: "button[aria-label='Edit account name']",
    renameAccountInput: "input[name='name']",
    saveButton: "button:has-text('Save')",
    cancelButton: "button:has-text('Cancel')",
    addAccountButton: "button:has-text('Add accounts')",
    addAccountWithPrivateKeyButton: "button:has-text('Import private key')",
    addAccountWithMnemonicButton: "button:has-text('Import mnemonic')",
    renameAccountLabel: "Rename",
    addressesLabel: "Addresses",
    pinToTopLabel: "Pin to top",
    hideAccountLabel: "Hide account",
};
