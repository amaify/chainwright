import { createWriteStream } from "node:fs";
import { Readable } from "node:stream";
import type * as streamWeb from "node:stream/web";
import { styleText } from "node:util";
import cliProgress from "cli-progress";

const TIMEOUT = 120_000;

type DownloadFileArgs = {
    url: string;
    destination: string;
};

export async function downloadFile({ url, destination }: DownloadFileArgs) {
    const controller = new AbortController();
    const requestTimeout = setTimeout(() => controller.abort(), TIMEOUT);

    try {
        const response = await fetch(url, { redirect: "follow", signal: controller.signal });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status} ${response.statusText}`);
        }

        const totalBytes = parseInt(response.headers.get("content-length") || "0", 10);
        let downloaded = 0;

        const nodeStream = Readable.fromWeb(response.body as streamWeb.ReadableStream);

        const progressBar = new cliProgress.SingleBar({
            format: `Downloading ${styleText("cyan", "{bar}", { validateStream: false })} {percentage}%`,
            clearOnComplete: true,
            barCompleteChar: "\u2588",
            barIncompleteChar: "\u2591",
            hideCursor: true,
        });

        progressBar.start(totalBytes, 0, { speed: "N/A" });

        await new Promise((resolve, reject) => {
            const stream = createWriteStream(destination);
            nodeStream.pipe(stream);
            nodeStream.on("data", (chunk) => {
                downloaded += chunk.length;
                progressBar.update(downloaded);
            });
            stream.on("error", reject);
            stream.on("finish", () => {
                progressBar.stop();
                resolve(void 0);
            });
        });
    } catch (error) {
        console.error(
            styleText("redBright", `❌ Wallet extension download failed: ${error}`, { validateStream: false }),
        );
        throw error;
    } finally {
        clearTimeout(requestTimeout);
    }
}
