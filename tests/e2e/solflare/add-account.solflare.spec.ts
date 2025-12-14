import { expect } from "@playwright/test";
import { testWithsolflareFixture } from "@/tests/fixture/test-with-solflare-fixture";

const PRIVATE_KEY = [
    46, 95, 80, 248, 120, 23, 246, 78, 6, 150, 185, 220, 149, 145, 50, 19, 205, 73, 167, 160, 38, 61, 238, 114, 153, 66,
    125, 163, 35, 106, 188, 7, 166, 29, 137, 234, 146, 177, 72, 73, 130, 128, 44, 111, 134, 12, 77, 115, 187, 131, 176,
    224, 28, 178, 254, 180, 219, 10, 125, 170, 154, 243, 37, 201,
];

const test = testWithsolflareFixture;

test("Should add account successfully", async ({ solflare, solflarePage }) => {
    const WALLET_NAME = "Gamify";
    await solflare.addAccount({ privateKey: PRIVATE_KEY, walletName: WALLET_NAME });
    await expect(solflarePage.getByText("Gamify")).toBeVisible();
});
