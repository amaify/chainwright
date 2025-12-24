import type { Page } from "@playwright/test";
import { sleep } from "@/utils/sleep";
import { actionFooterSelectors } from "../selectors/action-footer";
import { humanize } from "../utils";

async function checkForError(page: Page, isFinished: () => boolean) {
    const INTERVAL = 300;

    while (true) {
        const _isFinished = isFinished();
        if (_isFinished) break;

        const errorContainer = page.locator("div:has(> h2:has-text('Simulation error'))");
        const isErrorContainerVisible = await errorContainer.isVisible().catch(() => false);

        if (isErrorContainerVisible) {
            const errorText = await errorContainer.locator("p").textContent();
            throw new Error(`[Confirm Transaction Error]: ${humanize(errorText ? errorText : "Unexpected error!")}`);
        }

        await sleep(INTERVAL);
    }
}

export async function confirmTransaction(page: Page) {
    // Check for any simulation error
    let isFinished = false;
    const _isFinished = () => isFinished;
    const runner = checkForError(page, _isFinished);

    const approveButton = page.locator(actionFooterSelectors.approveButton);
    runner.catch(async (error) => {
        if (error) {
            console.error((error as Error).message);
            await page.close();
        }
    });
    await approveButton.click();
    isFinished = true;
}
