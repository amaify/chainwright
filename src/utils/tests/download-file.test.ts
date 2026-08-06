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

    it("should log the status, status text and error body when the HTTP request fails", async () => {
        const url = "https://example.com/not-found.txt";
        const destination = path.resolve(TEST_DIR, "not-found.txt");

        // Mock fetch with a failed response
        global.fetch = vi.fn().mockResolvedValue({
            ok: false,
            status: 404,
            statusText: "Not Found",
            headers: new Headers(),
            text: vi.fn().mockResolvedValue("Resource not found"),
        });

        const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

        await expect(downloadFile({ url, destination })).rejects.toThrow();

        expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining("❌ Download failed: HTTP 404 Not Found"));
        expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining("Resource not found"));

        // Verify the in-flight request was aborted
        const fetchMock = global.fetch as unknown as ReturnType<typeof vi.fn>;
        const fetchOptions = fetchMock.mock.calls[0]?.[1] as { signal: AbortSignal };
        expect(fetchOptions.signal.aborted).toBe(true);

        consoleErrorSpy.mockRestore();
    });

    it("should truncate the error body to 500 characters when the HTTP request fails", async () => {
        const url = "https://example.com/server-error.txt";
        const destination = path.resolve(TEST_DIR, "server-error.txt");
        const longBody = "x".repeat(1000);

        global.fetch = vi.fn().mockResolvedValue({
            ok: false,
            status: 500,
            statusText: "Internal Server Error",
            headers: new Headers(),
            text: vi.fn().mockResolvedValue(longBody),
        });

        const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

        await expect(downloadFile({ url, destination })).rejects.toThrow();

        expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining("x".repeat(500)));
        expect(consoleErrorSpy).not.toHaveBeenCalledWith(expect.stringContaining("x".repeat(501)));

        consoleErrorSpy.mockRestore();
    });

    it("should omit the error body when reading it fails", async () => {
        const url = "https://example.com/unreadable-body.txt";
        const destination = path.resolve(TEST_DIR, "unreadable-body.txt");

        global.fetch = vi.fn().mockResolvedValue({
            ok: false,
            status: 502,
            statusText: "Bad Gateway",
            headers: new Headers(),
            text: vi.fn().mockRejectedValue(new Error("body stream error")),
        });

        const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

        await expect(downloadFile({ url, destination })).rejects.toThrow();

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            expect.stringContaining("❌ Download failed: HTTP 502 Bad Gateway"),
        );
        expect(consoleErrorSpy).not.toHaveBeenCalledWith(expect.stringContaining("\n"));

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

    it("should handle timeout and abort the request", async () => {
        const url = "https://example.com/slow-file.txt";
        const destination = path.resolve(TEST_DIR, "slow-file.txt");

        // Mock fetch to reject with AbortError
        const abortError = new Error("The operation was aborted");
        abortError.name = "AbortError";
        global.fetch = vi.fn().mockRejectedValue(abortError);

        await expect(downloadFile({ url, destination })).rejects.toThrow("The operation was aborted");
    });

    it("should log the error and resolve when writing to the destination fails", async () => {
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

        await expect(downloadFile({ url, destination })).resolves.toBeUndefined();

        expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining("❌ Download failed:"));
        expect(clearTimeoutSpy).toHaveBeenCalled();

        consoleErrorSpy.mockRestore();
        clearTimeoutSpy.mockRestore();
    });
});
