<h1 align="center">
<br>
<picture>
   <source media="(prefers-color-scheme: dark)" srcset="./.github/logo-dark.svg">
   <img src="./.github/logo-light.svg" alt="chainwright" width="500">
</picture>
<br><br>
<span align="center">
Test, automate, and verify every wallet interaction with the precision, your users expect.
</span>
<br><br>
<span align="center">
<a href="https://npm.im/chainwright"><img src="https://badgen.net/npm/v/chainwright"></a> <a href="https://npm.im/chainwright"><img src="https://badgen.net/npm/dm/chainwright"></a>
</span>
</h1>



Chainwright is an end-to-end testing toolkit for Web3 dapps built on Playwright. It helps you build and cache browser wallet extension state, then reuse it in your end-to-end tests through ready-made fixtures.

## Features

- Wallet setup CLI to build reusable extension cache
- Custom wallet extension source.
- Playwright fixtures for wallet + Dapp testing
- Support for multiple wallet profiles per wallet
- Wallet action APIs for onboarding, account switching, transaction confirmation, and more

## Supported Wallets

- Keplr
- MetaMask
- Meteor
- Petra
- Phantom
- Solflare

## Requirements

- Node.js `>=22.18`
- `@playwright/test@1.62.1` (peer dependency)

## Operating Systems
Supports the following operating systems:
- MacOS
- Linux
- Windows

## Installation

Before installing Chainwright, ensure to install Playwright's browser using the command below.

```bash
npx playwright install chromium
```

```bash
bunx playwright install chromium
```

After Installing Playwright's browser, install `Chainwright` and `@playwright/test`

```bash
pnpm add -D chainwright @playwright/test
```
```bash
bun add -D chainwright @playwright/test
```
```bash
npm install --save-dev chainwright @playwright/test
```
```bash
yarn add -D chainwright @playwright/test
```

## Quick Start

### 1. Create wallet setup files

Create a setup directory (default: `tests/wallet-setup`) and add files with a `*.setup.ts` domain in the filename, for example:

- `base.setup.ts`
- `base-two.setup.ts`
- `petra.setup.ts`
- `phantom-team-a.setup.ts`

Each file must export `defineWalletSetup(...)`.

Wallet setup examples: [Setup examples link](https://github.com/amaify/chainwright/tree/dev/examples)

```ts
import { defineWalletSetup } from "chainwright/core";
import { Metamask } from "chainwright/metamask";

const PASSWORD = "test1234"; // For Petra wallet, you have to use a strong password. e.g. PlayerPetra45!!
const SEED_PHRASE = "test test test test test test test test test test test test test";

export default defineWalletSetup(
  PASSWORD,
  async ({ walletPage }) => {
    const metamask = new Metamask(walletPage);

    await metamask.onboard({
      mode: "import",
      secretRecoveryPhrase: SEED_PHRASE,
      mainAccountName: "Main",
    });
  },
  {
    ...//Optional prarmeters here
  },
);
```

**For Wallets with additional accounts**

```ts
import { defineWalletSetup } from "chainwright/core";
import { Petra } from "chainwright/petra";

const PASSWORD = "PlayerPetra45!!";

export default defineWalletSetup(
  PASSWORD,
  async ({ walletPage }) => {
    const petra = new Petra(walletPage);

    await petra.onboard({
      mode: "importMnemonic",
      accountName: "default",
      network: "Testnet",
      secretRecoveryPhrase: "test test test...", // Seed phrase for the main account
      additionalAccounts: [
        {
          accountName: "nw-account",
          mode: "mnemonic",
          mnemonicPhrase: "test test test..." // Seed Phrase for this account
        },
      ]
    });
  },
  {
    ...//Optional prarmeters here
  }
);
```

To support multiple profiles in a single wallet (for example, MetaMask), only setup files from the second profile onward need a distinct profile name.

`main.setup.ts` can use the default profile, while `main-two.setup.ts` (and any additional setup files) should declare a unique profile name. Then, in any fixture that should use that profile, pass the exact `profileName`.

Example:
- `main.setup.ts`: uses the default profile
- `main-two.setup.ts`: defines `profileName: "profile two"`
- Fixture usage: `metamaskFixture({ profileName: "profile two" })`

```ts
import { defineWalletSetup } from "chainwright/core";
import { Metamask } from "chainwright/metamask";

const PASSWORD = "test1234"; // For Petra wallet, you have to use a strong password. e.g. PlayerPetra45!!
const SEED_PHRASE = "test test test test test test test test test test test test test";

export default defineWalletSetup(
  PASSWORD,
  async ({ walletPage }) => {
    const metamask = new Metamask(walletPage);

    await metamask.onboard({
      mode: "import",
      secretRecoveryPhrase: SEED_PHRASE,
      mainAccountName: "Main",
    });
  },
  {
    profileName: "profile two"
  },
);
```

**For custom wallet extension download URL and local path**

For security reasons, you might choose not to use the same wallet extension source that Chainwright uses internally. To fix this, you can provide your own wallet extension source via a download URL or a locally stored wallet extension.

>[!NOTE]
You must ensure that the version of the extension you provide matches the one Chainwright uses internally.

These are Chainwright's wallet extensions and their versions:
  
  - **MetaMask**: v13.33.0 [Source](https://github.com/MetaMask/metamask-extension/releases/tag/v13.33.0)
  - **Petra**: v2.4.8 [Source](https://github.com/amaify/chainwright/releases/tag/v0.1.0)
  - **Phantom**: v26.10.0 [Source](https://github.com/amaify/chainwright/releases/tag/v0.1.0)
  - **Solflare**: v2.19.1 [Source](https://github.com/amaify/chainwright/releases/tag/v0.1.0)
  - **Meteor**: v0.7.0 [Source](https://github.com/amaify/chainwright/releases/tag/v0.1.0)
  - **Keplr**: v0.13.39 [Source](https://github.com/amaify/chainwright/releases/tag/v0.1.0)

Example:

```ts
import { defineWalletSetup } from "chainwright/core";
import { Metamask } from "chainwright/metamask";

const PASSWORD = "test1234"; // For Petra wallet, you have to use a strong password. e.g. PlayerPetra45!!
const SEED_PHRASE = "test test test test test test test test test test test test test";

export default defineWalletSetup(
  PASSWORD,
  async ({ walletPage }) => {
    const metamask = new Metamask(walletPage);

    await metamask.onboard({
      mode: "import",
      secretRecoveryPhrase: SEED_PHRASE,
      mainAccountName: "Main",
    });
  },
  {
    extensionSource: {
        localPath: "Your local path here",
        // OR
        downloadUrl: "Download URL here",
        sha256: "Expectd SHA-256 hash here"
    },
  },
);
```

### 2. Build wallet cache

Run setup with the CLI (Supports **npx**, **bun**, **pnpm**, and **yarn**):

>[!NOTE]
By default, Chainwright looks for `tests/wallet-setup` in your base directory. However, you can specify the directory you want Chainwright to get your setup files from.

```bash

bun chainwright --wallets <Wallets you want to support>

Examples:
# Multiple wallet setup command
bun chainwright --wallets metamask phantom solflare

# Single wallet setup command
bun chainwright --metamask

# Overriding existing wallet cache during setup
bun chainwright --metamask --force

# Overriding multiple existing wallet cache during setup
bun chainwright --wallets metamask phantom petra --force
```

To specify a directory:

```bash
bun chainwright <directory path> <wallet>

Example:
bun chainwright ./src/e2e/setup-files --metamask
```

Useful flags:

- `-h, --help` shows you all the commands
- `-f, --force` overwrite existing cache
- `--wallets <wallets...>` select wallets (`metamask`, `solflare`, `petra`, `phantom`, `meteor`, `keplr`). Setup multiple wallets at  the same time.
- `-a, --all` setup all wallets
- `--kp, --keplr` setup keplr wallet
- `-m, --metamask` setup metamask wallet
- `--mt, --meteor` setup the meteor wallet
- `--pt, --petra` setup petra wallet
- `--ph, --phantom` setup phantom wallet
- `-s, --solflare` setup solflare wallet

Wallet profile cache is stored under:

- `.wallet-cache/<wallet>/wallet-data` (default profile)
- `.wallet-cache/<wallet>/<profileName>` (custom profile)

### 3. Use wallet fixtures in Playwright tests

```ts
import { expect, type Page } from "@playwright/test";
import { testWithChainwright } from "chainwright/core";
import { metamaskFixture } from "chainwright/metamask";

// Chainwright's Fixture
export const testWithMetamask = testWithChainwright(metamaskFixture());

// Extend Chainwright's metamaskFixture to suit your need
export const testDappFixture = testWithMetamask.extend<{dAppPage: Page}>({
    dappPage: async ({ page, baseURL }, use) => {
        await page.goto(`https://your-dapp.example`);
        await use(page);
    },
});

// Then in your tests do:
const test = testDappFixture;
test.describe("Example tests", () => {
  test("connect wallet to dapp", async ({ dappPage, metamask }) => {
    const connectButton = dappPage.getByRole("button", { name: /Connect/i})
    await connectButton.click();
    await metamask.connectToApp("Account 1");
    await expect(dappPage.getByText("Connected")).toBeVisible();
  });
})
```

> [!NOTE]
The wallet fixture will make use of the `default` wallet profile. If you specified a `profile-name` at the point of setting up, make sure to include it in the fixture.

```ts
// No profile name is specified at setup time
const testWithFixture = testWithChainwright(fixture())

// If a profile name is specified at setup time.
const testWithFixture = testWithChainwright(fixture({ profileName: "profile name" }))
```

`Wallet fixture parameters`:
- `profileName`?: string,
- `slowMo`?: number

## Worker-Scoped Fixture

Use worker-scoped fixtures when you want your tests to share the same wallet context. Setup and teardown run once per worker instead of per test, which speeds up CI runs and reduces flakiness caused by repeated wallet initialization.

```ts
import { type Page } from "@playwright/test";
import { testWithChainwright } from "chainwright/core";
import { metamaskWorkerScopeFixture } from "chainwright/metamask";

// Chainwright's worker scoped fixture
export const testWithFixture = testWithChainwright(metamaskWorkerScopeFixture());

// Your worker scoped fixture that extends Chainwright's worker scoped fixture
export const workerScopedFixture = testWithFixture.extend<{dAppPage: Page}>({
  dappPage: [
    async ({ workerScopeContents }, use) => {
        const { context, wallet, walletPage } = workerScopeContents;
        /** N.B:
         * wallet represents -> metamask, phantom, keplr, etc...
         * walletPage represents -> metamask wallet page, phantom wallet page, keplr wallet page, etc...
        */
        const _dappPage = await context.newPage();
        await _dappPage.goto(`http://example-site.com`);
        await use(_dappPage);
    },
    { scope: "worker" },
  ],
})

// Then in your tests do:
const test = workerScopedFixture;

test.describe("Example test", () => {
  test("Should confirm transaction", ({ dappPage, workerScopeContents}) => {
    const { wallet: metamask } = workerScopeContents
    await dappPage.getByRole("button", { name: "Send Tx" }).click();
    await metamask.confirmTransaction();
  });

  test("Should reject transaction", async ({ dappPage, workerScopeContents })=> {
    const { wallet: metamask } = workerScopeContents
    await dappPage.getByRole("button", { name: "Send Tx" }).click();
    await metamask.rejectTransaction();
  });
})

```

`Worker scoped fixture parameters`:

- `profileName?: string`
- `slowMo?: number`

### 4. Running in CI (GitHub Actions)
Running Chainwright in CI is very similar to running Playwright in CI. The only additional requirement is a cache-build step before executing tests, as shown below:

Why we make use of **xvfb**:
> [!IMPORTANT]
Browser extensions don't load in headless Chromium, so the tests have to run in headed mode. CI machines have no display, so launching a headed browser fails. xvfb provides a fake virtual display, letting Chromium run headed in CI as if a screen were attached. 

```yml
name: CI

on:
  workflow_dispatch:
  pull_request:
    branches: ["main"]

jobs:
  test:
    runs-on: ubuntu-22.04
    timeout-minutes: 60
    strategy:
      matrix:
        node-version: [24]

    steps:
      - name: Checkout code
        uses: actions/checkout@v5
        with:
          submodules: "recursive"
          fetch-depth: 0

      - name: Install pnpm
        uses: pnpm/setup@v2
        with:
          runtime: node@${{ matrix.node-version }}
          version: 11
          install: false
          cache: true

      - name: Install dependencies
        run: pnpm install --no-frozen-lockfile

      - name: Install XVFB
        run: sudo apt-get install -y xvfb

      - name: Install Playwright browsers
        run: pnpx playwright install chromium

      - name: Install Foundry
        uses: foundry-rs/foundry-toolchain@v1

      - name: Build cache
        run: xvfb-run pnpm run setup-wallets

      - name: Run end-to-end tests (Headful)
        run: xvfb-run pnpm playwright test --config=tests/playwright.config.ts
```

## Wallets By Module

Each wallet module exports:

- `<wallet>Fixture(...)`
- `<wallet>WorkerScopeFixture(...)`
- `<WalletClass>`

Examples:

- `metamaskFixture`, `metamaskWorkerScopeFixture`, `Metamask`
- `phantomFixture`, `phantomWorkerScopeFixture`, `Phantom`
- `petraFixture`, `petraWorkerScopeFixture`, `Petra`
- `solflareFixture`, `solflareWorkerScopeFixture`, `Solflare`
- `meteorFixture`, `meteorWorkerScopeFixture`, `Meteor`
- `keplrFixture`, `keplrWorkerScopeFixture`, `Keplr`

Extra MetaMask fixtures:

- `createAnvilNode(options?)`
- `connectToAnvil()`

Extra Phantom/Solflare fixtures:

- `autoCloseNotification` (auto fixture)

## Core APIs

### `defineWalletSetup`

```ts
defineWalletSetup(password, setupFn, config?)
```

- `password: string` - wallet unlock password saved as a `.txt` file in the wallet cache
- `setupFn: ({ context, walletPage }) => Promise<void>` - runs onboarding/setup flow
- `config?: { profileName?: string; slowMo?: number, extensionSource?: {downloadUrl: "...", localPath: "...", sha256: "..."} }` - useful for setting up multiple wallet profiles, running the setup in slow motion `slowMo` and using a custom extension source.

### `testWithChainwright`

```ts
testWithChainwright(customFixtures)
```

Merges Playwright `test` with your Chainwright fixture extension.

## Common Wallet Actions

Depending on wallet module, wallet class methods include:

- `onboard(...)`
- `unlock()`
- `lock()`
- `switchAccount(...)`
- `renameAccount(...)`
- `getAccountAddress(...)`
- `addAccount(...)`
- `connectToApp(...)`
- `confirmTransaction()`
- `rejectTransaction()`

Additional wallet-specific actions are available, for example:

- MetaMask: `switchNetwork`, `toggleShowTestnetNetwork`, `addCustomNetwork`
- Phantom: `switchNetwork`, `toggleOptionalChains`
- Petra/Solflare/Meteor: `switchNetwork`
- Meteor: `openSettings`

## License

MIT

---

Built by **Tobechukwu**. ([github](https://github.com/amaify))
Contributions are welcome: see [CONTRIBUTING.md](./CONTRIBUTING.md) to get involved.