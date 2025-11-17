import { expect } from "@playwright/test";
import { testWithPetraFixture } from "@/tests/fixture/test-with-petra-fixture";
import { accountSelectors } from "@/wallets/petra/selectors/homepage-selectors";

const test = testWithPetraFixture;

test.describe("E2E For Adding account in Petra wallet", () => {
    test("Should add account via private key", async ({ petra, petraPage }) => {
        const accountName = "Private key account";

        await petra.addAccount({
            accountName,
            mode: "privateKey",
            privateKey: "ed25519-priv-0xd273e27a5f7ede39b8c2f4bde793fb949ecf5019007b5959b7683d5d53a1240f",
        });

        const accountMenuButton = petraPage.locator(accountSelectors.accountOptionsMenuButton).first();
        const menuButtonTextContent = await accountMenuButton.textContent();
        const splitValue = menuButtonTextContent?.split("Switch wallet")[1]?.split("...")[0];

        expect(splitValue?.includes(accountName)).toBeTruthy();
    });

    test("Should add account via Mnemonic phrase", async ({ petra, petraPage }) => {
        const accountName = "Mnemonic phrase account";

        await petra.addAccount({
            accountName,
            mode: "mnemonic",
            mnemonicPhrase: "robot bomb spend next present ozone music engine charge public follow opinion",
        });

        const accountMenuButton = petraPage.locator(accountSelectors.accountOptionsMenuButton).first();
        const menuButtonTextContent = await accountMenuButton.textContent();
        const splitValue = menuButtonTextContent?.split("Switch wallet")[1]?.split("...")[0];

        // biome-ignore lint/style/noNonNullAssertion: nothing
        expect(accountName?.includes(splitValue!)).toBeTruthy();
    });
});
