# Contributing to Chainwright

Thanks for contributing to Chainwright. This guide covers how to set up your environment, run checks, and open a pull request.

## Prerequisites

- Node.js `>=22`
- `pnpm` (project uses `pnpm-lock.yaml`; CI uses pnpm 10)
- Chromium for Playwright:
  - `pnpm exec playwright install chromium`

Optional for local e2e workflows that mirror CI:
- `xvfb` (Linux/headful CI-style runs)
- Foundry (only needed for some dapp/e2e scenarios)

## Operating Systems

If you are on MacOS or Linux, you don't have to do anything extra. For windows users, you have to do the following:
- Biome (Formatting/Linting): Install Biome in your system's root via `npm i -g @biomejs/biome`

## Setup

1. Fork and clone the repo.
2. Install dependencies:
   - `pnpm install`

## Project Structure

- `src/`: core library, wallet modules, CLI
- `tests/e2e/`: end-to-end wallet and dapp specs
- `tests/wallet-setup/`: setup files used to build wallet cache
- `scripts/`: helper tooling (including wallet scaffolding)

## Development Commands

- `pnpm run lint` - Biome lint checks (`src`)
- `pnpm run format` - format `src` with Biome
- `pnpm run tests` - unit tests (Vitest, excludes e2e specs)
- `pnpm run dev` - setup wallet cache
- `pnpm run build` - compile package with tsup
- `pnpm run tests:e2e:ui` - open Playwright UI mode
- `pnpm run tests:e2e:debug` - run e2e in debug mode

## E2E Notes

- Chainwright e2e tests run with `workers: 1` to avoid extension conflicts.
- Wallet extensions require headed Chromium.
- In CI/Linux you usually run with `xvfb-run` to provide a virtual display.
- Build wallet cache before e2e runs:
  - `pnpm run dev`
- The Dapp tests make use of the deployed `https://chainwright-dapp.vercel.app/` app.

## Adding a New Wallet

Use the wallet scaffolder:

- `pnpm run add:wallet`: Specify the wallet name

Then implement wallet-specific actions/selectors and add/update tests in `tests/e2e` and `tests/wallet-setup`.

## Changesets (Required for User-Facing Changes)

This repository uses Changesets for versioning and releases.

When your PR changes behavior that should be released, add a changeset:

1. Run `pnpm run build`
2. Run `pnpm run changeset`
3. Select the version bump type
4. Write a short summary of the change
5. Run `pnpm run version-package`
6. Commit the generated file under

Release/versioning is handled by CI using Changesets.

## Pull Request Checklist

Before opening or updating a PR:

- Run `pnpm run lint`
- Run `pnpm run tests`
- Run relevant e2e tests when wallet/dapp behavior changes
- Add/update docs (README, inline docs) if behavior or APIs changed
- Add a changeset for releasable changes

## Commit and PR Guidance

- Keep PRs focused and small when possible.
- Include clear descriptions of user impact and test coverage.
- Link related issues.
- If your change affects multiple wallets, call that out explicitly in the PR description.

## Questions

If something is unclear, open an issue or draft PR with your proposal and context. Early feedback is welcome.


Just testing this out