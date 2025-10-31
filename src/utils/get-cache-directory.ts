import path from "node:path";
import { fileURLToPath } from "node:url";
import type { CLIOptions } from "@/types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BASE_DIR = path.resolve(__dirname, "..", "../.wallet-cache");

export default function getCacheDirectory(walletName: CLIOptions) {
    return path.resolve(`${BASE_DIR}/${walletName}`);
}
