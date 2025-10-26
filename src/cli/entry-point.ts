#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath } from "node:url";
import { select } from "@inquirer/prompts";
import { Command } from "commander";
import pc from "picocolors";
import { getSetupFunctionHash } from "@/core/get-setup-function-hash";
import { triggerCacheCreation } from "@/utils/trigger-cache-creation";
import { type CLIOptions, type SupportedWallets, WALLET_SETUP_DIR_NAME } from "../utils/constants";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BASE_DIR = path.join(__dirname, "..", "test", WALLET_SETUP_DIR_NAME);

export async function clientEntry() {
    const program = new Command();

    program
        .name(pc.yellow("Playwright Kit Web3"))
        .description(pc.green("A CLI tool for setting up wallet cache for E2E testing of web3 applications"))
        .option("-a, --all", "Setup all wallets", "all")
        .option("-m, --metamask", "Setup MetaMask", "metamask")
        .option("-s, --solflare", "Setup Solflare", "solflare")
        .version(pc.blue("0.1.0"))
        .command("setup-wallet")
        .argument(
            "[dir]",
            "Directory containing the wallet setup functions",
            path.join("src", "test", WALLET_SETUP_DIR_NAME),
        );

    await program.parseAsync(process.argv);

    const flags = program.opts();
    const flagValue = Object.keys(flags).filter((_key) => flags[_key] === true);
    const isFlagsPassed = flagValue.length > 0;

    const response: CLIOptions = !isFlagsPassed
        ? await select({
              message: "Select the wallet you want to setup",
              choices: [
                  { name: "MetaMask", value: "metamask" },
                  { name: "Solflare", value: "solflare" },
                  { name: "All", value: "all" },
              ],
              loop: false,
              pageSize: 10,
              default: "all",
          })
        : (flagValue[0] as CLIOptions);

    let walletSetupDir = BASE_DIR;
    const filteredArgs = program.args.filter((_arg) => _arg !== "setup-wallet");

    if (filteredArgs[0]) walletSetupDir = path.resolve(process.cwd(), filteredArgs[0]);

    const setFunctionHashes = await getSetupFunctionHash(walletSetupDir, response);

    for (const { hash, walletName } of setFunctionHashes) {
        await triggerCacheCreation({ walletName: walletName as SupportedWallets, walletHash: hash });
    }
}

clientEntry().catch((error) => console.log("Error: ", error));
