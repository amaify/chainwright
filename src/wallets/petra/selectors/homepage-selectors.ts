export const homepageSelectors = {
    depositButton: "button:has-text('Deposit')",
    sendButton: "button:has-text('Send')",
    receiveButton: "button:has-text('Receive')",
    openSettingsButton: "account-options-menu-button",
    settingsMenu: "global-menu",
    lockButton: "global-menu-lock",
    accountMenuButton: "account-menu-icon",
    accountCell: "multichain-account-cell-entropy",
};

export const unlockWalletSelectors = {
    passwordInput: "input[name='password']",
    unlockButton: "button:has-text('Unlock')",
};

export const accountSelectors = {
    accountOptionsMenuButton: "multichain-account-cell-end-accessory",
    accountDetailsLabel: "Account details",
    renameAccountLabel: "Rename",
    addressesLabel: "Addresses",
    pinToTopLabel: "Pin to top",
    hideAccountLabel: "Hide account",
    backButton: "back",
};
