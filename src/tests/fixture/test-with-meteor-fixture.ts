import { meteorFixture } from "@/wallets/meteor";

export const testWithMeteorFixture = meteorFixture();
export const testFixtureWithNetworkProfile = meteorFixture(undefined, "multiple-network");
