import type { Page } from "@playwright/test";

export async function openSettings(page: Page) {
    const settingsButton = page.getByRole("button", { name: "settings", exact: true });
    // Wait for the settings button to be visible during onboarding
    await settingsButton.waitFor({ state: "attached", timeout: 30_000 });
    await settingsButton.click();
}
