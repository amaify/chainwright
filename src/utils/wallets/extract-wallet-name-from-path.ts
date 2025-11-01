import path from "node:path";
import type { SupportedWallets } from "@/types";

export default function extractWalletNameFromPath(filePath: string) {
    const base = path.basename(filePath);

    const walletNameMatch = base.match(/^([a-z0-9_]+)(?:-[a-z0-9_]+)*\.setup\.(?:ts|js|mjs)$/i);

    if (!walletNameMatch) {
        throw new Error(`Invalid wallet setup filename: ${base} (expected "<name>[ -variant].setup.{ts,js,mjs}")`);
    }
    return walletNameMatch[1] as SupportedWallets;
}
