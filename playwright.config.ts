import { defineConfig, devices } from "@playwright/test";

// Build reporter array dynamically

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
    testDir: "./src/tests",
    /* Run tests sequentially to avoid MetaMask extension conflicts */
    workers: 1,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 1 : 0,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: [["list"]],

    /* Global timeout for each test */
    timeout: 1000000000,

    /* Configure projects for major browsers */
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
    ],
});
