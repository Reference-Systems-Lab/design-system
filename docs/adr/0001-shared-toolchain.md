# 1. The shared frontend toolchain

- **Status:** Accepted
- **Date:** 2026-10-09

## Context

Four repositories write TypeScript and Vue: the storefront (Nuxt), checkout and admin (Vue with Vite),
and the design system itself; the platform's engineering docs build with the same tools. Each needs
lint, formatting, stylesheet and type-checking rules, and the rules should be the same everywhere so
code moves between repositories without arguments about style. The design system owns that shared
configuration (README: "Shared lint, formatting, stylesheet and TypeScript configuration for the other
repositories"). The choice of tools was made system-wide in commerce#3 (DE-3), on the runtime and
package manager of commerce's ADR 0001 (DE-2).

## Decision

- **Published here, as versioned packages** on GitHub Packages under `@reference-systems-lab`
  (DE-10):
  - `eslint-config`: ESLint 10 flat config with typescript-eslint `recommendedTypeChecked`,
    eslint-plugin-vue's recommended rules and eslint-plugin-vuejs-accessibility;
  - `prettier-config`: Prettier 3;
  - `stylelint-config`: Stylelint with `stylelint-config-standard-vue`, and no raw colour values
    outside the tokens, because styling flows from tokens (AGENTS.md);
  - `tsconfig`: `base`, `vue-app` and `library` presets, all strict.
- **TypeScript 6.0 (`~6.0`)**, with vue-tsc 3 for templates, until the Vue tools support TypeScript
  7: TypeScript 7 ships no compiler API, which typescript-eslint, vue-tsc and openapi-typescript use.
  Dependabot ignores TypeScript majors.
- **Tests and dead code:** Vitest 5 with coverage thresholds, and Knip, are part of the toolchain;
  each repository runs them with its own settings.
- **How consumers use them:** tools are peer dependencies, so each repository pins the tool versions
  in its own lockfile; the plugins come with the config packages. A breaking rule change is a major
  version (AGENTS.md: packages are versioned).

## Alternatives

- **A config copy per repository:** no package to publish, but the copies drift.
- **Biome or oxlint instead of ESLint and Prettier:** faster, but without the Vue template and
  accessibility rules the frontends rely on.
- **TypeScript 7 now:** faster builds, but no compiler API, so the type-aware lint, vue-tsc and SDK
  generation would break.

## Consequences

- A rule changes once, here, and reaches each repository through a reviewed version bump.
- Every consumer needs read access to the packages: `GITHUB_TOKEN` in CI (granted per package) and a
  token with `read:packages` on a developer's machine.
- Moving to TypeScript 7 is one deliberate change, made when the Vue tools support it.
