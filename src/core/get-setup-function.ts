import { globSync as glob } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { styleText } from "node:util";
import type { CLIOptions, GetSetupFunctionFileList, SupportedWallets } from "@/types";
import extractWalletNameFromPath from "@/utils/wallets/extract-wallet-name-from-path";
import type { defineWalletSetup } from "./define-wallet-setup";

type SetupFunctionHash = {
    walletSetupDir: string;
    selectedWallets: Array<CLIOptions>;
};

type SetupFunction = Awaited<ReturnType<typeof defineWalletSetup>>;

const toPosix = (path: string) => path.replace(/\\/g, "/");

const createGlobPattern = (walletSetupDir: string) => {
    const base = toPosix(path.resolve(walletSetupDir));
    return `${base}/**/*.setup.{ts,js,mjs}`;
};

const importSetupFile = (filePath: string) => {
    const importUrl = new URL(pathToFileURL(filePath)).href;
    return import(importUrl);
};

export default async function getSetupFunction({ walletSetupDir, selectedWallets }: SetupFunctionHash) {
    const globPattern = createGlobPattern(walletSetupDir);
    const fileList = glob(globPattern, {
        withFileTypes: true,
    })
        .filter((dirent) => dirent.isFile())
        .map((dirent) => path.join(dirent.parentPath, dirent.name))
        .sort();

    // biome-ignore lint/style/noNonNullAssertion: We will always have a selected wallet
    const _selectedWallets = selectedWallets.length === 1 ? selectedWallets[0]! : selectedWallets;

    // Log a warning if the selected wallet is not found in the file list
    const supportedWallets: Array<SupportedWallets> = ["metamask", "solflare", "petra", "meteor", "keplr", "phantom"];
    Array.isArray(_selectedWallets) &&
        _selectedWallets.forEach((wallet) => {
            if (!supportedWallets.includes(wallet as SupportedWallets)) {
                console.warn(
                    styleText(
                        "magenta",
                        `Unsupported wallet: "${wallet}". Supported wallets are: ${supportedWallets.join(", ")}`,
                        { validateStream: false },
                    ),
                );
            }
        });

    const filteredFileList: Array<string> =
        _selectedWallets === "all"
            ? fileList
            : Array.isArray(_selectedWallets)
              ? fileList.filter((filePath) => _selectedWallets.some((wallet) => filePath.includes(wallet)))
              : fileList.filter((filePath) => filePath.includes(_selectedWallets));

    const _fileList: GetSetupFunctionFileList[] = filteredFileList.map((filePath) => ({
        filePath,
        walletName: extractWalletNameFromPath(filePath),
    }));

    if (!_fileList.length || _fileList.length === 0) {
        throw new Error(
            [
                `No wallet setup file found at ${walletSetupDir} for wallet: "${selectedWallets}".`,
                `Setup files must use a ".setup.{ts,js,mjs}" extension and include a valid wallet name.`,
                `Examples: "metamask.setup.ts", "solflare.setup.ts", "phantom.setup.ts", "metamask-connected.setup.ts"`,
            ].join("\n "),
        );
    }

    const setupFunction = await Promise.all(
        _fileList.map(async ({ filePath, walletName }) => {
            const module = await importSetupFile(filePath);
            const setupFunction = (await module.default) as SetupFunction;
            const { fn, config, password } = setupFunction;

            return {
                walletName,
                fileList: _fileList,
                config,
                walletPassword: password,
                setupFunction: fn,
            };
        }),
    );

    return setupFunction;
}
