import fs from "node:fs";

export default function isDirEmpty(cacheDirectory: string) {
    try {
        return fs.readdirSync(cacheDirectory).length === 0;
    } catch (error) {
        if (error instanceof Error && error.message.includes("ENOENT")) {
            return true;
        }

        throw error;
    }
}
