import type { BrowserContext } from "@playwright/test";
import type { ExtensionName } from "@/types";

type Extensions = Array<{ id: string; name: string }>;

/**
 * Returns the extension ID for the given extension name. The ID is fetched from the `chrome://extensions` page.
 *
 * @param context - The browser context.
 * @param extensionName - The name of the extension, e.g., `Petra`.
 *
 * @returns The extension ID.
 */
export async function getWalletExtensionIdFromBrowser(context: BrowserContext, extensionName: ExtensionName) {
    const page = await context.newPage();
    await page.goto("chrome://extensions");

    const allExtensions = (await page.evaluate("chrome.management.getAll()")) as Extensions;

    const targetExtension = allExtensions.find(
        (extension) => extension.name.toLowerCase() === extensionName.toLowerCase(),
    );

    if (!targetExtension) {
        throw new Error(
            [
                `[GetExtensionId] Extension with name ${extensionName} not found.`,
                `Available extensions: ${allExtensions.map((extension) => extension.name).join(", ")}`,
            ].join("\n"),
        );
    }

    await page.close();

    return targetExtension.id;
}
