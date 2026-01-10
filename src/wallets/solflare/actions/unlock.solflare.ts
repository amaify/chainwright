import type { Page } from "@playwright/test";
import { getWalletPasswordFromCache } from "@/utils/wallets/get-wallet-password-from-cache";

export async function unlock(page: Page) {
    const PASSWORD = await getWalletPasswordFromCache("solflare");
    const passwordInput = page.getByTestId("input-password");
    await passwordInput.fill(PASSWORD);

    const unlockButton = page.getByTestId("btn-unlock");
    await unlockButton.click();

    const heroSectionContainer = page.getByTestId("section-portfolio-hero");
    await heroSectionContainer.waitFor({ state: "attached" });
}
