import { testWithMeteorFixture } from "@/tests/fixture/test-with-meteor-fixture";

const test = testWithMeteorFixture;

test("Should successfully open the settings menu", async ({ meteor, meteorPage }) => {
    await meteor.openSettings();
    const settingsHeading = meteorPage.getByRole("heading", { name: "Settings", exact: true });
    await test.expect(settingsHeading).toBeVisible();
});
