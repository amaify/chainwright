import fs from "node:fs";

export async function removeTempContextDir(dir: string) {
    return fs.promises.rm(dir, { recursive: true, force: true, maxRetries: 5 }).catch((error) => error);
}
