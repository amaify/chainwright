export const homepageSelectors = {
    openSidebarMenuButton: "div[cursor='pointer']:has(> div[cursor='pointer'])",
    menuPopupContent: "div[id='modal-root-3']",
    lockWalletButton: "div:has(> div:has-text('Lock Wallet'))",
};

export const unlockWalletSelectors = {
    unlockButton: "button[type='submit']:has-text('Unlock')",
    passwordInput: "input[placeholder='Type Your Password']",
};
