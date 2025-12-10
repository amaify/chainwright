import { defineConfig, devices } from "@playwright/test";

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
    testDir: "./e2e",
    /* Run tests sequentially to avoid MetaMask extension conflicts */
    workers: 1,
    /* Retry on CI only */
    retries: process.env.CI ? 1 : 0,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: [["list"]],

    /* Global timeout for each test */
    timeout: process.env.CI ? 180_000 : 360_000,

    use: {
        // We are using locally deployed Metamask Test Dapp for somePhantom tests.
        baseURL: "http://localhost:9999",

        // Collect all traces on CI, and only traces for failed tests when running locally.
        // See https://playwright.dev/docs/trace-viewer.
        trace: process.env.CI ? "on" : "retain-on-failure",
        screenshot: "only-on-failure",
        video: "retain-on-failure",
        // Added for getting account address
        permissions: ["clipboard-read"],
    },

    /* Configure projects for major browsers */
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
    ],
});
