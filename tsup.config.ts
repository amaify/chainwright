import { defineConfig } from "tsup";

export default defineConfig({
    name: "chainwright",
    entry: [
        "src/cli/index.ts",
        "src/core/index.ts",
        "src/wallets/keplr/index.ts",
        "src/wallets/metamask/index.ts",
        "src/wallets/meteor/index.ts",
        "src/wallets/petra/index.ts",
        "src/wallets/phantom/index.ts",
        "src/wallets/solflare/index.ts",
    ],
    external: ["@inquirer/checkbox", "@playwright/test", "adm-zip", "cli-progress", "commander"],
    outDir: "dist",
    format: "esm",
    platform: "node",
    target: "es2024",
    sourcemap: false,
    clean: true,
    dts: true,
    splitting: false,
    bundle: true,
    shims: true,
    minify: true,
});
