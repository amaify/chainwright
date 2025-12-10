import type { Page } from "@playwright/test";

export default async function waitForHttpGetResponse(page: Page, url: string) {
    console.info(`Waiting for http response from ${url} on ${page.url()}`);

    return page.waitForResponse(
        (response) => {
            if (!response.url().match(url)) {
                return false;
            }

            console.info("Waiting for response:", response.url());

            if (!response.ok()) {
                return response.status() !== 200 && response.request().method() === "GET";
            }

            return response.status() === 200 && response.request().method() === "GET";
        },
        { timeout: 60_000 },
    );
}
