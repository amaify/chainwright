import { errors, type Page } from "@playwright/test";
import { loadingSelectors } from "@/wallets/metamask/selectors/loading-selectors";
import { sleep } from "./sleep";

const TIMEOUT = 15_000;

export default async function waitForStablePage(page: Page) {
    await page.waitForLoadState("load", { timeout: TIMEOUT });
    await page.waitForLoadState("domcontentloaded", { timeout: TIMEOUT });
}

export const waitForSelector = async (selector: string, page: Page, timeout: number) => {
    await waitForStablePage(page);

    try {
        const locator = page.locator(`div[class="${selector}"]`);
        await locator.waitFor({ state: "hidden", timeout });
    } catch (error) {
        if (error instanceof errors.TimeoutError) {
            console.info(`Loading indicator '${selector}' not found - continuing.`);
        } else {
            console.error(`Error while waiting for loading indicator '${selector}' to disappear`);
            throw error;
        }
    }
};

export const waitForMetaMaskLoad = async (page: Page) => {
    try {
        // Then wait for all loading indicators to disappear
        await waitForSelector(loadingSelectors.loadingSpinner, page, TIMEOUT);
    } catch (error) {
        // Log error but don't fail - the page might be usable anyway
        console.warn("Warning during MetaMask load:", error);
    }

    // Add a small delay to ensure UI is fully ready
    await sleep(300);

    return page;
};
