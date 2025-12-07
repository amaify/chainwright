import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve("./");
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templateWalletDir = path.resolve(__dirname, "templates", "wallet");
const templateTestsDir = path.resolve(__dirname, "templates", "tests");

const pascalCase = (str: string) => str.replace(/(^\w|-\w)/g, (m) => m.replace("-", "").toUpperCase());

type WriteToFile = {
    baseDir: string;
    templateDir: string;
    walletName: string;
    fileTemplate: string;
};

type FileAndFolderStructure = {
    files: Array<string>;
    folders: Array<string>;
};

function writeToFile({ fileTemplate, baseDir, walletName, templateDir }: WriteToFile) {
    const WalletName = pascalCase(walletName);

    const fileName = fileTemplate.replaceAll("{{walletName}}", walletName);
    const destPath = path.resolve(baseDir, fileName);
    const templatePath = path.resolve(templateDir, `${fileTemplate}.tpl`);

    let content = fs.existsSync(templatePath)
        ? fs.readFileSync(templatePath, "utf-8") !== ""
            ? fs.readFileSync(templatePath, "utf-8")
            : `// ${fileName}`
        : `// ${fileName}`;

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
    const structure = JSON.parse(fs.readFileSync(structurePath, "utf8")) as FileAndFolderStructure;

    // Create folders
    structure.folders.forEach((folder: string) => {
        fs.mkdirSync(path.resolve(walletDir, folder), { recursive: true });
    });

    // Create files
    structure.files.forEach((fileTemplate: string) => {
        writeToFile({ fileTemplate, baseDir: walletDir, walletName, templateDir: templateWalletDir });
    });

    console.info(`✅ Wallet '${walletName}' created at: wallets/${walletName}`);
}

function createTests(walletName: string) {
    const testsDir = path.resolve(projectRoot, "src", "tests");
    const testsStructurePath = path.resolve(__filename, "..", "tests-structure.json");
    const structure = JSON.parse(fs.readFileSync(testsStructurePath, "utf8")) as FileAndFolderStructure;

    // Create folders
    structure.folders.forEach((folder) => {
        // console.log("Creating folders ---> ", folder);
        fs.mkdirSync(path.resolve(testsDir, folder), { recursive: true });
    });

    // Create files
    structure.files.forEach((fileTemplate: string) => {
        writeToFile({ fileTemplate, baseDir: testsDir, walletName, templateDir: templateTestsDir });
    });

    console.info(`✅ Tests for '${walletName}' added at: tests/e2e/${walletName}`);
}

// CLI entry point
export function main() {
    const [, , walletName] = process.argv;
    if (!walletName) {
        console.error("❌ Please provide a wallet name. E.g. `npm run create:wallet metamask`");
        process.exit(1);
    }

    createWallet(walletName);
    createTests(walletName);
    biomeFormat().catch((err) => console.error(`⚠️ Error running prettier: ${err}`));
}

// Detect if script is run directly, then call main()
if (path.resolve(__filename) === path.resolve(process?.argv?.[1] ?? "")) {
    main();
}
