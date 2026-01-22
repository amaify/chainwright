import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

type GenerateTypes = {
    walletName: string;
    profileName: string;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const profileNamePath = path.resolve(__dirname, "..", "..", "generated-profile-name.types.ts");

const pascalCase = (str: string) => str.replace(/(^\w)/g, (m) => m.toUpperCase());

export async function generateTypes({ walletName, profileName }: GenerateTypes) {
    const walletProfileName = pascalCase(walletName);
    const profileNameUnion = `export type ${walletProfileName}Profiles = "${profileName}";`;

    if (fs.existsSync(profileNamePath)) {
        const existingContent = fs.readFileSync(profileNamePath, "utf-8");

        const profileNameMatch = existingContent.match(
            new RegExp(`export type ${walletProfileName}Profiles = ("[^"]+"(?:\\s*\\|\\s*"[^"]+")*)`),
        );

        if (profileNameMatch) {
            const fullMatch = profileNameMatch[0];

            if (!fullMatch.includes(`"${profileName}"`)) {
                const updatedUnion = fullMatch.concat(` | "${profileName}"`);
                const updatedContent = existingContent.replace(fullMatch, updatedUnion);
                try {
                    fs.writeFileSync(profileNamePath, updatedContent);
                } catch (error) {
                    console.error("Error updating existing profile name type: ", error);
                }
            }
        } else {
            try {
                fs.appendFileSync(profileNamePath, `\n${profileNameUnion}`, { encoding: "utf-8" });
            } catch (error) {
                console.error("Error appending new profile name type: ", error);
            }
        }
    } else {
        try {
            fs.writeFileSync(profileNamePath, profileNameUnion);
        } catch (error) {
            console.error("Error writing new profile name type: ", error);
        }
    }
}
