import fs from "node:fs";
import path from "node:path";
import AdmZip from "adm-zip";
import picocolors from "picocolors";
import type { CLIOptions } from "./constants";
import { downloadFile } from "./download-file";
import getCacheDirectory from "./get-cache-directory";

type Args = {
    name: CLIOptions;
    walletHash: string;
    downloadUrl: string;
};

export async function prepareWalletExtension({ downloadUrl, name, walletHash }: Args) {
    const CACHE_DIR_NAME = getCacheDirectory(name);
    const walletName = name.toUpperCase();
    const zipFilePath = path.join(CACHE_DIR_NAME, `${name}-${walletHash}-extension.zip`);
    const outputPath = path.join(CACHE_DIR_NAME, `${name}-${walletHash}-extension`);

    // Ensure the cache directory exists
    if (!fs.existsSync(CACHE_DIR_NAME)) {
        fs.mkdir(CACHE_DIR_NAME, { recursive: true }, (error) => {
            if (error) throw Error("Failed to create cache directory");
            console.info(`✅ ${walletName} Cache directory created successfully.`);
        });
    }

    // Download MetaMask if not cached
    if (fs.existsSync(zipFilePath)) {
        console.info(`✅ ${walletName} Version is downloaded already.`);
    } else {
        console.info(picocolors.cyanBright(`📥 Downloading ${name} extension...`));
        await downloadFile({ url: downloadUrl, destination: zipFilePath });
        console.info(picocolors.green(`✅ ${name.toUpperCase()} Extension downloaded successfully.`));
    }

    // Unzip the archive if not already extracted
    if (!fs.existsSync(outputPath)) {
        console.info(`📦 Extracting extension...`);
        const zip = new AdmZip(zipFilePath);
        zip.extractAllTo(outputPath, true);
        console.info(`✅ ${walletName} Extension extracted successfully.`);
    } else {
        console.info(picocolors.yellow(`ℹ️ ${walletName}: Using cached extracted extension.`));
    }

    // Validate the extracted extension
    const manifestPath = path.join(outputPath, "manifest.json");
    if (!fs.existsSync(manifestPath)) {
        throw new Error(`❌ (${walletName}) Invalid extension: manifest.json not found`);
    }

    return outputPath;
}
