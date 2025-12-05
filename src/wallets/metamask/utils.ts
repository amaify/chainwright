import { errors, type Page } from "@playwright/test";
import { sleep } from "@/utils/sleep";
import waitForStablePage from "@/utils/wait-for-stable-page";
import { loadingSelectors } from "./selectors/loading-selectors.metamask";

const TIMEOUT = 60_000;

export const waitForSelector = async (selector: string, page: Page, timeout: number) => {
    await waitForStablePage(page);

    try {
        const locator = page.locator(`div[class="${selector}"]`);
        await locator.waitFor({ state: "detached", timeout });
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
