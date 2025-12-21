import type { Fixtures, TestType } from "@playwright/test";
import { test as base, mergeTests } from "@playwright/test";

/**
 * Creates a test environment with Playwright kit integration.
 *
 * This function merges the base Playwright test with custom fixtures, allowing for
 * seamless integration of Synpress capabilities in Playwright tests.
 *
 * Playwright kit web3 is a wrapper around Playwright that adds support for testing
 * Web3 and blockchain applications, particularly those involving
 * wallet interactions.
 *
 * @param customFixtures - Custom fixtures to be merged with the base test.
 * @returns A merged test object that includes both Playwright and capabilities.
 *
 * @example
 * ```typescript
 * const test = testWithPlaywrightKit(myCustomFixtures);
 * test('My Web3 test', async ({ page, synpress }) => {
 *   // Test implementation using Playwright and Synpress
 * });
 * ```
 */
export default function testWithPlaywrightKit<CustomFixtures extends Fixtures>(
    customFixtures: TestType<CustomFixtures, object>,
): TestType<CustomFixtures, object> {
    return mergeTests(base, customFixtures);
}
