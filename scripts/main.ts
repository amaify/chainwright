import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve("./");
const __filename = fileURLToPath(import.meta.url);

const templateWalletDir = path.resolve(__filename, "..", "templates", "wallet");

const pascalCase = (str: string) => str.replace(/(^\w|-\w)/g, (m) => m.replace("-", "").toUpperCase());

type WriteToFile = {
    baseDir: string;
    templateDir: string;
    walletName: string;
    fileTemplate: string;
};

function writeToFile({ fileTemplate, baseDir, walletName, templateDir }: WriteToFile) {
    const WalletName = pascalCase(walletName);

    const fileName = fileTemplate.replace("{{walletName}}", walletName);
    const destPath = path.resolve(baseDir, fileName);
    const templatePath = path.resolve(templateDir, `${fileTemplate}.tpl`);

    let content = fs.existsSync(templatePath) ? fs.readFileSync(templatePath, "utf-8") : `// ${fileName}`;

    // Keep original casing for walletName
    content = content
        // Replace PascalCase version
        .replace(/\{\{\s*WalletName\s*\}\}/g, WalletName)
        // Replace lowercase version
        .replace(/\{\{\s*walletName\s*\}\}/g, walletName);

    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.writeFileSync(destPath, content);
}

/**
 * Run the Prettier format and linting
 */
async function biomeFormat() {
    const bin = process.platform === "win32" ? "bun.cmd" : "bun";

    return new Promise((resolve, reject) => {
        const child = spawn(bin, ["run", "format"], {
            stdio: "inherit",
            env: process.env,
            shell: false,
            cwd: process.cwd(),
        });

        child.on("error", reject);
        child.on("close", (code, signal) => {
            if (code === 0) {
                console.info("✅ Biome format successful");
                return resolve(void 0);
            }
            reject(new Error(`Child process exited with code ${code} and signal ${signal}`));
        });
    });
}

/**
 * Create a new wallet
 * @param walletName - The name of the wallet to create
 */
function createWallet(walletName: string) {
    const walletDir = path.resolve(projectRoot, "src", "wallets", walletName);

    if (fs.existsSync(walletDir)) {
        console.error(`❌ Wallet '${walletName}' already exists at: ${walletDir}`);
        process.exit(1);
    }

    fs.mkdirSync(walletDir, { recursive: true });

    const structurePath = path.resolve(__filename, "..", "structure.json");
    const structure = JSON.parse(fs.readFileSync(structurePath, "utf8"));

    // Create folders
    structure.folders.forEach((folder: string) => {
        fs.mkdirSync(path.resolve(walletDir, folder), { recursive: true });
    });

    // Create files
    structure.files.forEach((fileTemplate: string) => {
        writeToFile({ fileTemplate, baseDir: walletDir, walletName, templateDir: templateWalletDir });
    });

    console.info(`✅ Wallet '${walletName}' created at: wallets/${walletName}`);

    biomeFormat().catch((err) => console.error(`⚠️ Error running prettier: ${err}`));
}

// CLI entry point
export function main() {
    const [, , walletName] = process.argv;
    if (!walletName) {
        console.error("❌ Please provide a wallet name. E.g. `npm run create:wallet metamask`");
        process.exit(1);
    }

    createWallet(walletName);
}

// Detect if script is run directly, then call main()
if (path.resolve(__filename) === path.resolve(process?.argv?.[1] ?? "")) {
    main();
}
