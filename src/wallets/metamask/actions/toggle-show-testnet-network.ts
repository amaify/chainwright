import { expect, type Page } from "@playwright/test";
import { homepageSelectors, settingsSelectors } from "../selectors/homepage-selectors.metamask";

export async function toggleShowTestnetNetwork({ page }: { page: Page }) {
    const settingsButton = page.locator(`div:has(> button[data-testid='${homepageSelectors.openSettingsButton}'])`);
    await settingsButton.click();

    const networksButton = page.getByTestId(settingsSelectors.networksButton);
    await networksButton.click();

    const netowrksDialog = page.getByRole("dialog");
    await expect(netowrksDialog).toBeVisible();
    await expect(netowrksDialog).toContainText(/manage networks/i);

    const networkSwitchToggle = "div:has(> p:has-text('Show test networks'))";
    await netowrksDialog.locator(networkSwitchToggle).scrollIntoViewIfNeeded();

    const showTestnetNetworkToggle = netowrksDialog.locator(networkSwitchToggle);
    const isNetworkSwitchOffToggleVisible = await showTestnetNetworkToggle
        .locator("label[class='toggle-button toggle-button--off']")
        .isVisible()
        .catch(() => false);

    if (!isNetworkSwitchOffToggleVisible) {
        await netowrksDialog.getByRole("button", { name: /close/i }).click();
        console.info("Testnet networks are already visible.");
        return;
    }
    await showTestnetNetworkToggle.locator("label[class='toggle-button toggle-button--off']").click();

    await page.getByTestId("Sepolia").scrollIntoViewIfNeeded();
    await expect(page.getByTestId("Sepolia")).toBeVisible();

    const closeButton = netowrksDialog.getByRole("button", { name: /close/i });
    await closeButton.click();
}
