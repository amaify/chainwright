import fs from "node:fs";
import path from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import type { CLIOptions } from "@/types";
import getSetupFunction from "../get-setup-function";

describe("getSetupFunction", () => {
    const TEST_ROOT = path.resolve(process.cwd(), "src/core/test/wallet-setup-test-files");

    let dirCounter = 0;

    function createSetupDir(setupFiles: string[]): string {
        const walletSetupDir = path.resolve(TEST_ROOT, `case-${++dirCounter}`);
        fs.mkdirSync(walletSetupDir, { recursive: true });

        setupFiles.forEach((filename) => {
            fs.writeFileSync(
                path.resolve(walletSetupDir, filename),
                `
                    import { defineWalletSetup } from "@/core/define-wallet-setup";

                    export default defineWalletSetup("test1234", async () => {
                        console.info("Setting up ${filename}.....");
                        return void 0;
                    }, ${filename === "metamask-two.setup.ts" ? '{ profileName: "profile-two" }' : undefined});

                `,
            );
        });

        return walletSetupDir;
    }

    afterAll(() => {
        fs.rmSync(TEST_ROOT, { force: true, recursive: true });
    });

    async function runSetup(walletSetupDir: string, selectedWallets: Array<CLIOptions> = ["all"]) {
        return getSetupFunction({ walletSetupDir, selectedWallets });
    }

    it("should return all setup functions when selectedWallet is 'all'", async () => {
        const walletSetupDir = createSetupDir([
            "metamask.setup.ts",
            "metamask-two.setup.ts",
            "phantom.setup.ts",
            "solflare.setup.ts",
        ]);

        const result = await runSetup(walletSetupDir);

        expect(result).toHaveLength(4);
        expect(result[0]).toHaveProperty("walletName");
        expect(result[0]).toHaveProperty("setupFunction");
        expect(result[0]).toHaveProperty("fileList");
        expect(result[0]?.fileList).toHaveLength(4);

        // Verify all results have fileList
        result.forEach((item) => {
            expect(item).toHaveProperty("fileList");
            expect(item.fileList).toHaveLength(4);
        });
    });

    it("should ignore directories whose names match the setup file pattern", async () => {
        const walletSetupDir = createSetupDir(["metamask.setup.ts", "phantom.setup.ts"]);
        fs.mkdirSync(path.resolve(walletSetupDir, "solflare.setup.ts"));

        const result = await runSetup(walletSetupDir);

        expect(result).toHaveLength(2);
        const walletNames = result.map((r) => r.walletName);
        expect(walletNames).not.toContain("solflare");
    });

    it("should filter setup functions when selectedWallet is specific", async () => {
        const walletSetupDir = createSetupDir(["metamask.setup.ts", "metamask-two.setup.ts", "phantom.setup.ts"]);

        const result = await runSetup(walletSetupDir, ["metamask"]);

        expect(result).toHaveLength(2);
        result.forEach((item) => {
            expect(item).toHaveProperty("walletName", "metamask");
            expect(item).toHaveProperty("setupFunction");
            expect(item).toHaveProperty("fileList");
        });
    });

    it("should throw an error when no setup files are found", async () => {
        const walletSetupDir = createSetupDir([]);

        await expect(runSetup(walletSetupDir, ["all"])).rejects.toThrowError(
            [
                `No wallet setup file found at ${walletSetupDir} for wallet: "all".`,
                `Setup files must use a ".setup.{ts,js,mjs}" extension and include a valid wallet name.`,
                `Examples: "metamask.setup.ts", "solflare.setup.ts", "phantom.setup.ts", "metamask-connected.setup.ts"`,
            ].join("\n "),
        );
    });

    it("should throw an error when filtered file list is empty", async () => {
        const walletSetupDir = createSetupDir(["phantom.setup.ts", "solflare.setup.ts"]);

        await expect(runSetup(walletSetupDir, ["metamask"])).rejects.toThrow(
            [
                `No wallet setup file found at ${walletSetupDir} for wallet: "metamask".`,
                `Setup files must use a ".setup.{ts,js,mjs}" extension and include a valid wallet name.`,
                `Examples: "metamask.setup.ts", "solflare.setup.ts", "phantom.setup.ts", "metamask-connected.setup.ts"`,
            ].join("\n "),
        );
    });

    it("should handle wallet profiles correctly", async () => {
        const walletSetupDir = createSetupDir(["metamask-two.setup.ts"]);

        const result = await runSetup(walletSetupDir, ["metamask"]);

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty("walletName", "metamask");
        expect(result[0]).toHaveProperty(["config", "profileName"], "profile-two");
        expect(result[0]).toHaveProperty("setupFunction");
    });

    it("should resolve a relative walletSetupDir to absolute file paths", async () => {
        const walletSetupDir = createSetupDir(["metamask.setup.ts"]);
        const relativeDir = path.relative(process.cwd(), walletSetupDir);

        const result = await runSetup(relativeDir, ["metamask"]);

        expect(result).toHaveLength(1);
        result[0]?.fileList.forEach(({ filePath }) => {
            expect(path.isAbsolute(filePath)).toBe(true);
        });
    });

    it("should sort file list alphabetically", async () => {
        const walletSetupDir = createSetupDir(["solflare.setup.ts", "metamask.setup.ts", "phantom.setup.ts"]);

        const result = await runSetup(walletSetupDir, ["all"]);

        const expectedPaths = ["metamask.setup.ts", "phantom.setup.ts", "solflare.setup.ts"].map((filename) =>
            path.resolve(walletSetupDir, filename),
        );
        const firstResult = result[0];
        if (firstResult) {
            const fileListPaths = firstResult.fileList.map((f) => f.filePath);
            expect(fileListPaths).toEqual(expectedPaths);
        }
    });

    it("should include fileList in all returned objects", async () => {
        const walletSetupDir = createSetupDir(["metamask.setup.ts", "phantom.setup.ts"]);

        const result = await runSetup(walletSetupDir, ["all"]);

        expect(result).toHaveLength(2);
        result.forEach((item) => {
            expect(item).toHaveProperty("fileList");
            expect(item.fileList).toHaveLength(2);
            expect(item.fileList).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ filePath: path.resolve(walletSetupDir, "metamask.setup.ts") }),
                    expect.objectContaining({ filePath: path.resolve(walletSetupDir, "phantom.setup.ts") }),
                ]),
            );
        });
    });

    it("should correctly extract wallet names from file paths", async () => {
        const walletSetupDir = createSetupDir(["metamask.setup.ts", "metamask-two.setup.ts", "phantom.setup.ts"]);

        const result = await runSetup(walletSetupDir, ["all"]);

        expect(result).toHaveLength(3);
        // Verify wallet names are correctly extracted
        const walletNames = result.map((r) => r.walletName);
        expect(walletNames).toContain("metamask");
        expect(walletNames).toContain("phantom");
    });
});
