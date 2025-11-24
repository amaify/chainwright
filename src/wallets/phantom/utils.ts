import { type BrowserContext, expect } from "@playwright/test";
import { sleep } from "@/utils/sleep";
import waitForStablePage from "@/utils/wait-for-stable-page";
import { PhantomProfile } from "./phantom-profile";

export async function getPageFromContextPhantom(context: BrowserContext) {
    const phantom = new PhantomProfile();
    const indexUrl = await phantom.indexUrl();

    /**
     * Phantom MV3 is flaky on startup: sometimes the popup crashes with
     * "Could not establish connection. Receiving end does not exist."
     * Giving it 1s to finish its own internal boot sequence makes the popup stable.
     */
    await sleep(1_000);

    const promptPage = await context.newPage();

    await expect(async () => {
        await promptPage.goto(indexUrl);
        await waitForStablePage(promptPage);
    }).toPass();

    return promptPage;
}
