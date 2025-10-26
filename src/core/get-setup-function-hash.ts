import fs from "node:fs";
import path from "node:path";
import { glob } from "glob";
import type { CLIOptions } from "@/utils/constants";
import { createWalletSetupHash } from "./create-hash";

type SetupFunctionHash = {
    walletSetupDir: string;
    selectedWallet: CLIOptions;
};

export const createGlobPattern = (walletSetupDir: string) => path.join(walletSetupDir, "**", "*.setup.{ts,js,mjs}");

export async function getSetupFunctionHash({ walletSetupDir, selectedWallet }: SetupFunctionHash) {
    const globPattern = createGlobPattern(walletSetupDir);
    const fileList = (await glob(globPattern)).sort();
    const filteredFileList =
        selectedWallet === "all" ? fileList : fileList.filter((filePath) => filePath.includes(selectedWallet));

    const _fileList = filteredFileList.map((filePath) => ({
        filePath,
        walletName: filePath.split("/").pop()?.split(".")[0]?.split("-")[0] as CLIOptions,
    }));

    if (!_fileList.length || _fileList.length === 0) {
        throw new Error(
            `No wallet setup files found at ${walletSetupDir} Remember that all wallet setup files must end with ".setup.{ts,js,mjs}" extension!`,
        );
    }

    const setupFunctionHashes = await Promise.all(
        _fileList.map(async ({ filePath, walletName }) => {
            const sourceCode = fs.readFileSync(filePath, "utf8");
            const hash = createWalletSetupHash(sourceCode);
            const setupFunction = (await import(filePath)) as () => Promise<void>;

            return { hash, walletName, setupFunction };
        }),
    );

    return setupFunctionHashes;
}
