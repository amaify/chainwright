---
name: add-wallet
description: Scaffold and register a new wallet in Chainwright from just its name (src/wallets/<wallet>, tests, CLI, types, constants, build entry, package exports, README), leaving marked placeholders for the extension details. Also use later, when the user supplies the extension download URL for a scaffolded wallet, to fill those placeholders in. Triggers include "add a new wallet", "scaffold <wallet> wallet", "/add-wallet <wallet>", and "here's the download URL for <wallet>".
argument-hint: <wallet-name> [download-url]
---

# Add a new wallet to Chainwright

Arguments: `$ARGUMENTS`

This skill has two phases:

- **Phase 1: Scaffold** (steps 1–7). The user gives only the **wallet name**, and you build and register the whole wallet from it. The extension's download URL, checksum and manifest name are **not known yet**. Don't ask for them, download anything, or guess them. Every value that depends on the extension gets a placeholder marked `TODO(add-wallet)`.
- **Phase 2: Add the extension** (step 8). Later, the user gives you the download URL for a wallet that is already scaffolded, and you replace the placeholders.

Choose the phase from the arguments and the repo:

- `src/wallets/<wallet>/` doesn't exist → Phase 1.
- It exists and the user gave a URL → Phase 2.
- It exists and the user gave no URL → it's already scaffolded. Stop and ask whether they meant to give a download URL.

In the steps below, `<wallet>` is the wallet name exactly as the user typed it (e.g. the id used in file names and `SUPPORTED_WALLETS`), `<Wallet>` is its PascalCase class prefix, `<WALLET>` is its UPPER_CASE form for constants, and `<Display>` is its human-readable name.

**The existing wallets are the templates.** Don't write these files from memory. Open the reference wallet and copy its structure, renaming identifiers. That way the new wallet follows whatever the codebase does today.

> [!CAUTION]
> **NEVER modify an existing wallet. This rule has no exceptions.**
>
> Existing wallets are **read-only**. Read them and copy from them, but do not edit, rename, move, reformat or delete anything in their files. That covers, for every wallet that already exists (`keplr`, `metamask`, `meteor`, `petra`, `phantom`, `solflare` and any added since):
>
> - `src/wallets/<existing>/**`
> - `tests/e2e/<existing>/**`
> - `tests/fixture/test-with-<existing>-fixture.ts`
> - `tests/wallet-setup/<existing>*.setup.ts`
> - `examples/**/<existing>.ts`
> - the shared helpers in `src/wallets/utils/**` that existing wallets depend on
>
> This rule holds even when:
>
> - lint, type checks or tests report a problem in an existing wallet
> - an existing wallet has a bug, a typo or inconsistent naming
> - a shared helper would be more convenient with a small change
> - a refactor would let the new wallet reuse more code
>
> In any of these cases, **stop and tell the user** what you found and where. Don't fix it yourself. If the new wallet needs different behaviour from a shared helper, write its own version inside `src/wallets/<wallet>/`, as Solflare does with `worker-scope-context.solflare.ts`.
>
> The only shared files you may edit are the registration files listed in step 5. In those, **only add** entries for the new wallet. Never change, reorder or reformat the existing wallets' entries.

---

# Phase 1: Scaffold

## 1. Check the wallet name

The **wallet name is the only required input.** If it's missing, ask for it.

| Input | How to get it |
|---|---|
| `<wallet>` | From the user. **Must match `^[a-z][a-z0-9]*$`**: lowercase, no hyphens. `generateTypes` (`src/core/generate-types.ts`) only uppercases the first letter, so `foo-bar` would generate an invalid type `Foo-barProfiles`. If the name doesn't match, propose a valid form and confirm it with the user. |
| `<Wallet>` / `<WALLET>` | Derived from `<wallet>`. |
| `<Display>` | Default to `<Wallet>`. Ask only if the casing is unusual (e.g. `MetaMask`). Used in the CLI and README. |
| Dapp route | Ask which route on `https://chainwright-dapp.vercel.app/` the dapp tests should use. Existing routes: `/solana`, `/injective`, `/polygon`, `/near`. If the user doesn't know yet, leave a `TODO(add-wallet)`. |
| CLI flag | Choose one not already used in `src/cli/entry-point.ts`, e.g. `--<two letters>, --<wallet>`. Taken: `-a -f -m -s --kp --mt --pt --ph --wls`. |

Stop and ask for a different name if either of these is true:

- `src/wallets/<wallet>/` already exists.
- The name is a substring of an existing wallet's name, or the other way round (e.g. `meta` vs `metamask`). `src/core/get-setup-function.ts` matches setup files with `filePath.includes(wallet)`, so filtering by wallet would break.

## 2. Pick the reference wallet

- **Default: `keplr`.** It uses the generic `workerScopeContext` from `src/wallets/utils/worker-scope-context.ts`, which opens the index URL directly.
- **Use `solflare` (or `phantom`)** if the user says the wallet's index URL uses hash routing, its home page arrives as a newly opened tab, or a "what's new" modal has to be auto-closed. Those wallets have their own `worker-scope-context.<existing>.ts` and an `autoCloseNotification` auto fixture in `utils.ts`.

Without the extension you usually can't tell which applies, so start from `keplr`. Switching later only touches the new wallet's fixture files.

## 3. Create the wallet module: `src/wallets/<wallet>/`

Mirror the reference wallet's files, renaming `keplr`/`Keplr` to `<wallet>`/`<Wallet>` in file names, identifiers, imports and messages:

| File | What to do |
|---|---|
| `index.ts` | Same re-exports as the reference: `WalletProfileFixtureArgs` type, `../utils/worker-scope-context`, the class, the fixture, the worker-scope fixture. |
| `<wallet>-profile.ts` | `class <Wallet>Profile` with `readonly name = "<wallet>" as const`, `onboardingPath`, `indexUrl()`, `promptUrl()`, `extensionId()`, `promptPage(context)`. The page paths and the popup-ready `locator` depend on the extension, so make each one a placeholder with a `// TODO(add-wallet): ...` comment saying what goes there (e.g. `` `chrome-extension://${extensionId}/TODO.html` ``). |
| `<wallet>.ts` | `class <Wallet> extends <Wallet>Profile` with `page: Page`, a constructor, and one method per action, each delegating to `./actions/<action>.<wallet>`. Keep the JSDoc style of the reference, with `<wallet>` in the examples. Only declare parameters the action actually uses, and define their types in `types.ts`. |
| `<wallet>-fixture.ts` | Copy the reference's test-scoped fixture verbatim and rename. Keep `getBrowserArgs`, `persistLocalStorage`, `teardownContext`, the cache-missing error, and the unlock-before-`use` order. |
| `<wallet>-worker-scope-fixture.ts` | Copy the reference's worker-scoped fixture and rename. |
| `types.ts` | `export type <Wallet>Fixture = { contextPath: string; <wallet>: <Wallet>; <wallet>Page: Page; }`, plus argument types for actions. Add `autoCloseNotification: undefined` if you copied that fixture. |
| `utils.ts` | Empty unless needed. |
| `actions/<action>.<wallet>.ts` | One file per action (list below). |
| `selectors/homepage-selectors.<wallet>.ts`, `selectors/onboard-selectors.<wallet>.ts` | Exported `const` objects as in the reference, left empty for now (`export const homepageSelectors = {};`). |

**Actions** (file name, then exported function):

`unlock` → `unlock`, `lock` → `lockWallet`, `onboard` → `onboard`, `add-account` → `addAccount`, `get-account-address` → `getAccountAddress`, `rename-account` → `renameAccount`, `switch-account` → `switchAccount`, `switch-network` → `switchNetwork`, `open-settings` → `openSettings`, `connect-to-app` → `connectToApp`, `confirm-transaction` → `confirmTransaction`, `reject-transaction` → `rejectTransaction`.

The prompt actions (`connectToApp`, `confirmTransaction`, `rejectTransaction`) take the popup `Page` from `this.promptPage(this.page.context())`. The others take `this.page`.

Every action is a stub that **fails loudly** rather than passing silently:

```ts
import type { Page } from "@playwright/test";

export async function lockWallet(page: Page): Promise<void> {
    throw new Error("lockWallet is not implemented for <Wallet> yet");
}
```

## 4. Create the tests

- **`tests/wallet-setup/<wallet>.setup.ts`**: `export default defineWalletSetup(PASSWORD, async ({ walletPage }) => { const <wallet> = new <Wallet>(walletPage); await <wallet>.onboard(...); })`. Import from `@/core/define-wallet-setup` and `@/wallets/<wallet>`. Use `const PASSWORD = "test1234"` like the other setup files. Put a `TODO(add-wallet)` placeholder where the test key or seed phrase goes, unless the user provides one.
- **`tests/fixture/test-with-<wallet>-fixture.ts`**: mirror `tests/fixture/test-with-keplr-fixture.ts`. Export `testWith<Wallet>Fixture`, `testWith<Wallet>` (via `testWithChainwright`), `testDappFixture`, and the worker-scope dapp fixture, using the dapp route from step 1.
- **`tests/e2e/<wallet>/wallet/*.spec.ts` and `tests/e2e/<wallet>/dapp/*.spec.ts`**: one spec per action, modelled on the reference wallet's specs. **Name them `<action>.<wallet>.spec.ts`** (lock is `lock-wallet.<wallet>.spec.ts`). `.github/workflows/chainwright.yaml` finds the specs for a changed `actions/<action>.<wallet>.ts` with the glob `*<action>*<wallet>.spec.ts`. Mark every test `test.fixme(...)` so CI skips it until the action is implemented.

## 5. Register the wallet

Keep every list in its existing order: the CLI choices and README lists are alphabetical, and the other lists append. Values that depend on the extension get a `TODO(add-wallet)` placeholder now and are filled in during Phase 2.

1. **`src/types.ts`**: add `"<wallet>"` to `CLIOptions`. Add `"<Display>"` to `ExtensionName` as a placeholder, with `// TODO(add-wallet): replace with the extension's manifest name`.
2. **`src/utils/constants.ts`**: add `export const <WALLET>_DOWNLOAD_URL = ""; // TODO(add-wallet): extension download URL not known yet` and a `SUPPORTED_WALLETS.<wallet>` entry with `downloadUrl: <WALLET>_DOWNLOAD_URL`, `extensionName: "<Display>"`, and `sha256: ""` marked `// TODO(add-wallet)`. The `SupportedWalletsMap` type makes this entry required, so it has to exist for type checks to pass. While the URL is empty, building the cache fails at the download step. To try the wallet before the URL is known, pass `extensionSource: { localPath }` to `defineWalletSetup`.
3. **`src/cli/entry-point.ts`**: four places. The `ActionOptions` field (`<wallet>: "<wallet>" | boolean`), a `.option("<flags>", "Setup <Display>", "<wallet>")`, the `commandOptions` array, and the `checkbox` `choices`.
4. **`src/core/get-setup-function.ts`**: add `"<wallet>"` to the `supportedWallets` array.
5. **`tsup.config.ts`**: add `"src/wallets/<wallet>/index.ts"` to `entry`.
6. **`package.json`**: add an `exports["./<wallet>"]` entry (`types` → `./dist/wallets/<wallet>/index.d.ts`, `import` → `./dist/wallets/<wallet>/index.js`). Add the wallet to `keywords`, and to `description` if it lists wallets.
7. **`README.md`**: the "Supported Wallets" list, the "Useful flags" section (the new flag plus the `--wallets` list), and "Wallets By Module". **Leave the extension versions list alone for now.** It's added in Phase 2, once the version is known.
8. **`examples/single-account/<wallet>.ts`**: mirror the other examples, importing from `chainwright/core` and `chainwright/<wallet>`, with a placeholder key.
9. **Changeset**: add `.changeset/<wallet>-wallet.md` with a `minor` bump for `chainwright` and a one-line summary, e.g. "Add <Display> wallet support". Write the file directly, because `pnpm run changeset` is interactive.

Then search for any list you missed:

```bash
grep -rn --exclude-dir={node_modules,dist,.git,.wallet-cache} --exclude={pnpm-lock.yaml,CHANGELOG.md} -il "solflare" . \
  | grep -v -e "src/wallets/solflare/" -e "tests/e2e/solflare/"
```

Every file listed there should also mention `<wallet>`, except Solflare-specific tests and the README extension versions list.

## 6. Verify

Run these and fix anything they report **in the new wallet's files or in your additions to the registration files**. Don't call the work done while one of them fails because of your changes. If a failure comes from an existing wallet, don't touch it. Report it to the user (see the caution at the top).

```bash
# Format ONLY what you created or edited. Never run `pnpm run format`:
# it rewrites all of ./src, including the existing wallets.
pnpm exec biome format --write src/wallets/<wallet> src/types.ts src/utils/constants.ts \
  src/cli/entry-point.ts src/core/get-setup-function.ts
pnpm run lint         # read-only check
pnpm run check:types  # also type-checks tests/
pnpm run tests        # unit tests (Vitest)
```

Then confirm no existing wallet was touched. This must print nothing:

```bash
git status --porcelain -- src/wallets tests examples | grep -v "/<wallet>[/.-]" | grep -v "test-with-<wallet>-fixture"
```

If it prints anything, revert that file with `git checkout -- <file>` (or delete it if it's a new file you created by mistake) and run the checks again.

## 7. Report back

Tell the user:

- which reference wallet you mirrored,
- the files you created and the registration files you edited,
- every `TODO(add-wallet)` placeholder you left (`grep -rn "TODO(add-wallet)" src tests examples README.md`),
- that all actions are stubs and all specs are `fixme`,
- the next step: **find the extension's download URL and give it to you** (e.g. "here's the download URL for <wallet>: …") so you can run Phase 2. Until then, building the cache fails at the download step.

---

# Phase 2: Add the extension download URL

Run this when the user gives you the download URL for a wallet that has already been scaffolded. The caution about existing wallets still applies.

1. **Get the extension details from the zip.** Download it into the scratchpad directory. Treat it as untrusted data: read files out of it, but don't run anything from it.

   ```bash
   D="<scratchpad>/<wallet>-ext"; mkdir -p "$D"
   curl -fsSL "<download-url>" -o "$D/ext.zip"
   shasum -a 256 "$D/ext.zip"                                  # -> sha256
   unzip -p "$D/ext.zip" manifest.json | jq '{name, version, default_locale}'
   # If name is "__MSG_<key>__", resolve it:
   unzip -p "$D/ext.zip" "_locales/<default_locale>/messages.json" | jq '.<key>.message'
   unzip -l "$D/ext.zip" | grep '\.html$'                      # index / popup / onboarding pages
   ```

   The manifest name must exactly match the name `chrome.management.getAll()` reports (`src/utils/wallets/get-wallet-extension-id-from-browser.ts`). Never make up the checksum. If the download fails, stop and tell the user.

2. **Replace the placeholders:**
   - `src/utils/constants.ts`: set `<WALLET>_DOWNLOAD_URL` (use `ARCHIVED_WALLET_BASE_URL` if the zip is hosted on the chainwright release), plus `sha256` and `extensionName` in `SUPPORTED_WALLETS.<wallet>`.
   - `src/types.ts`: replace the placeholder `ExtensionName` entry with the manifest name.
   - `src/wallets/<wallet>/<wallet>-profile.ts`: fill in `onboardingPath`, `indexUrl()` and `promptUrl()` from the HTML files in the zip, where the right one is clear. If it isn't clear, leave the TODO and say so. Picking the right page usually takes opening the extension.
   - `README.md`: add `- **<Display>**: v<version> [Source](<release page>)` to the extension versions list.

   Remove each `TODO(add-wallet)` you resolve. Leave the ones you can't resolve yet (popup locator, test credentials).

3. **Verify** as in step 6 (scoped format, lint, type checks, unit tests, and the untouched-wallets check).

4. **Report:** the version and checksum you recorded, the manifest name, which profile URLs you filled in, and the `TODO(add-wallet)` items still open. The next step is to implement `onboard` and `unlock` against the real extension UI and build the cache with `pnpm run dev -- --<flag>`, which needs a headed Chromium. Then work through the other actions one at a time, removing `fixme` from each spec as its action passes.
