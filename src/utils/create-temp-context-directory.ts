import path from "node:path";
import { fileURLToPath } from "node:url";

// import type { SupportedWallets } from "@/types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BASE_CONTEXT_DIR = path.resolve(__dirname, "..", "../.wallet-context");

export default async function createTempContextDirectory(testId: string) {
    return path.resolve(BASE_CONTEXT_DIR, `${testId}`);
}
