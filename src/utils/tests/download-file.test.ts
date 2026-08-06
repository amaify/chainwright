import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { downloadFile } from "../download-file";

// Mock cli-progress
const createMockProgressBar = () => ({
    start: vi.fn(),
    update: vi.fn(),
    stop: vi.fn(),
});

vi.mock("cli-progress", () => ({
    default: {
        SingleBar: vi.fn().mockImplementation(function SingleBar() {
            // When called with 'new', return the mock object
            return {
                start: vi.fn(),
                update: vi.fn(),
                stop: vi.fn(),
            };
        }),
    },
}));

describe("downloadFile", () => {
    const TEST_DIR = path.resolve(process.cwd(), "src/utils/.test-downloads");

    beforeAll(() => {
        if (!fs.existsSync(TEST_DIR)) {
            fs.mkdirSync(TEST_DIR, { recursive: true });
        }
    });

    afterEach(() => {
        // Clean up downloaded files after each test
        if (fs.existsSync(TEST_DIR)) {
            const files = fs.readdirSync(TEST_DIR);
            for (const file of files) {
                fs.unlinkSync(path.resolve(TEST_DIR, file));
            }
        }
        vi.clearAllMocks();
    });

    afterAll(() => {
        // Clean up test directory
        if (fs.existsSync(TEST_DIR)) {
            fs.rmSync(TEST_DIR, { recursive: true, force: true });
        }
    });

    it("should successfully download a file", async () => {
        const url = "https://example.com/file.txt";
        const destination = path.resolve(TEST_DIR, "test-file.txt");
        const content = "Hello, World!";
        const contentBuffer = Buffer.from(content);

        // Mock fetch with a successful response
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            status: 200,
            headers: new Headers({
                "content-length": contentBuffer.length.toString(),
            }),
            body: Readable.toWeb(Readable.from(contentBuffer)) as ReadableStream,
        });

        const clearTimeoutSpy = vi.spyOn(global, "clearTimeout");

        await expect(downloadFile({ url, destination })).resolves.toBeUndefined();

        // Verify file was written
        expect(fs.existsSync(destination)).toBe(true);
        const fileContent = fs.readFileSync(destination, "utf-8");
        expect(fileContent).toBe(content);

        // Verify fetch was called with correct parameters
        expect(global.fetch).toHaveBeenCalledWith(url, {
            redirect: "follow",
            signal: expect.any(AbortSignal),
        });
        expect(clearTimeoutSpy).toHaveBeenCalled();

        clearTimeoutSpy.mockRestore();
    });

    it("should handle download with progress updates", async () => {
        const url = "https://example.com/large-file.txt";
        const destination = path.resolve(TEST_DIR, "large-file.txt");
        const content = "This is a larger file content for testing progress";
        const contentBuffer = Buffer.from(content);

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            status: 200,
            headers: new Headers({
                "content-length": contentBuffer.length.toString(),
            }),
            body: Readable.toWeb(Readable.from(contentBuffer)) as ReadableStream,
        });

        await downloadFile({ url, destination });

        // Get the progress bar instance that was created
        const cliProgress = (await import("cli-progress")).default;
        const singleBarMock = cliProgress.SingleBar as unknown as ReturnType<typeof vi.fn>;
        const mockProgressBar = singleBarMock.mock.results[0]?.value as ReturnType<typeof createMockProgressBar>;

        // Verify progress bar methods were called
        expect(mockProgressBar.start).toHaveBeenCalledWith(contentBuffer.length, 0, { speed: "N/A" });
        expect(mockProgressBar.update).toHaveBeenCalled();
        expect(mockProgressBar.stop).toHaveBeenCalled();
    });

    it("should log the status and status text and rethrow when the HTTP request fails", async () => {
        const url = "https://example.com/not-found.txt";
        const destination = path.resolve(TEST_DIR, "not-found.txt");

        // Mock fetch with a failed response
        global.fetch = vi.fn().mockResolvedValue({
            ok: false,
            status: 404,
            statusText: "Not Found",
            headers: new Headers(),
        });

        const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

        await expect(downloadFile({ url, destination })).rejects.toThrow("HTTP 404 Not Found");

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            expect.stringContaining("❌ Wallet extension download failed: Error: HTTP 404 Not Found"),
        );

        consoleErrorSpy.mockRestore();
    });

    it("should handle download when content-length header is missing", async () => {
        const url = "https://example.com/file.txt";
        const destination = path.resolve(TEST_DIR, "file-no-length.txt");
        const content = "File without content-length";
        const contentBuffer = Buffer.from(content);

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            status: 200,
            headers: new Headers(),
            body: Readable.toWeb(Readable.from(contentBuffer)) as ReadableStream,
        });

        await expect(downloadFile({ url, destination })).resolves.toBeUndefined();

        // Get the progress bar instance that was created
        const cliProgress = await import("cli-progress");
        const singleBarMock = cliProgress.default.SingleBar as unknown as ReturnType<typeof vi.fn>;
        const mockProgressBar = singleBarMock.mock.results[0]?.value as ReturnType<typeof createMockProgressBar>;

        // Progress bar should start with 0 when content-length is missing
        expect(mockProgressBar.start).toHaveBeenCalledWith(0, 0, { speed: "N/A" });

        // Verify file was still written
        expect(fs.existsSync(destination)).toBe(true);
        const fileContent = fs.readFileSync(destination, "utf-8");
        expect(fileContent).toBe(content);
    });

    it("should log the error and rethrow when the request is aborted", async () => {
        const url = "https://example.com/slow-file.txt";
        const destination = path.resolve(TEST_DIR, "slow-file.txt");

        // Mock fetch to reject with AbortError
        const abortError = new Error("The operation was aborted");
        abortError.name = "AbortError";
        global.fetch = vi.fn().mockRejectedValue(abortError);

        const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

        await expect(downloadFile({ url, destination })).rejects.toThrow("The operation was aborted");

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            expect.stringContaining("❌ Wallet extension download failed: AbortError: The operation was aborted"),
        );

        consoleErrorSpy.mockRestore();
    });

    it("should log the error and rethrow when writing to the destination fails", async () => {
        const url = "https://example.com/file.txt";
        // Destination inside a directory that does not exist, so the write stream errors
        const destination = path.resolve(TEST_DIR, "missing-dir", "file.txt");
        const contentBuffer = Buffer.from("Hello, World!");

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            status: 200,
            headers: new Headers({
                "content-length": contentBuffer.length.toString(),
            }),
            body: Readable.toWeb(Readable.from(contentBuffer)) as ReadableStream,
        });

        const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
        const clearTimeoutSpy = vi.spyOn(global, "clearTimeout");

        await expect(downloadFile({ url, destination })).rejects.toThrow();

        expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining("❌ Wallet extension download failed:"));
        expect(clearTimeoutSpy).toHaveBeenCalled();

        consoleErrorSpy.mockRestore();
        clearTimeoutSpy.mockRestore();
    });
});
