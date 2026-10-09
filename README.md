# design-system

The shared visual language of the platform, and one of its flagship pieces. It holds the components,
design tokens, documentation and shared frontend tooling, published as versioned packages that every
frontend uses.

## Responsibilities

- Reusable, accessible UI components
- Design tokens for color, typography, spacing, elevation and border radius, plus themes (including
  dark mode) and responsive behavior
- Accessibility standards
- The documentation site at `design.rsl-commerce.test`
- A playground where you change the tokens (primary and secondary color, border radius, spacing
  scale, typography, dark mode) and watch the components update live
- Shared lint, formatting, stylesheet and TypeScript configuration for the other repositories
- Publishing the packages and the documentation site

## Does not own

- Application screens or business logic. The applications compose components into pages.
- Data fetching or any knowledge of the API.

## Works with

- **storefront, admin and checkout.** They consume its packages.
- **platform.** It serves the documentation site locally.

## Packages

Published privately to GitHub Packages under `@reference-systems-lab`
([ADR 0002](docs/adr/0002-design-system-stack.md); the toolchain in
[ADR 0001](docs/adr/0001-shared-toolchain.md)):

| Package                                  | What it gives you                                                                                                                                       |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@reference-systems-lab/tokens`          | `tokens.css` (custom properties in `@layer ds.tokens`, light and dark), plus `tokens.json` and typed `tokens` for scripts                               |
| `@reference-systems-lab/eslint-config`   | ESLint flat config: typescript-eslint type-checked, Vue, accessibility, and CSS (`@eslint/css`) with colours only from tokens; Prettier owns formatting |
| `@reference-systems-lab/prettier-config` | Prettier config                                                                                                                                         |
| `@reference-systems-lab/tsconfig`        | `base.json`, `vue-app.json` and `library.json`, all strict, for TypeScript 6.0                                                                          |

Components (`ui-core`, `ui`) and the documentation site come later.

## Using them

Installing needs a token that can read packages: `GITHUB_TOKEN` in CI (each consuming repository is
granted read access on each package), or a classic personal access token with `read:packages` on your
machine, in `~/.npmrc` as `//npm.pkg.github.com/:_authToken=<token>`. In the consuming repository:

```sh
# .npmrc
@reference-systems-lab:registry=https://npm.pkg.github.com
# The hardened min-release-age=7 would hold back each of our releases for a week; our own,
# attested packages are exempt (npm's min-release-age-exclude).
min-release-age-exclude[]=@reference-systems-lab/*
```

```sh
npm install -D @reference-systems-lab/eslint-config @reference-systems-lab/prettier-config \
  @reference-systems-lab/tsconfig
npm install @reference-systems-lab/tokens
```

```js
// eslint.config.js
import config from "@reference-systems-lab/eslint-config";
export default [
  ...config,
  { languageOptions: { parserOptions: { tsconfigRootDir: import.meta.dirname } } },
];
```

The ESLint config also lints CSS (`@eslint/css`): no literal colours (hex, colour functions,
named colours), only `var(--ds-color-…)`. It can't read `<style>` blocks, so `.vue` files may not
have one: a component imports its own stylesheet (`import "./Button.css"`), and the config fails a
`.vue` file with a `<style>` block. The ESLint config type-checks through TypeScript's project service, so every `.ts` and `.vue`
file it lints must be in a `tsconfig.json` `include` (config files in plain `.js` are not
type-checked).

```jsonc
// package.json: "prettier": "@reference-systems-lab/prettier-config"
// tsconfig.json
{ "extends": "@reference-systems-lab/tsconfig/vue-app.json" }
```

```css
/* once, at the app's entry: import "@reference-systems-lab/tokens/tokens.css" */
.price {
  color: var(--ds-color-text);
  padding: var(--ds-space-inset);
}
```

Read semantic tokens only (`--ds-color-*`, `--ds-space-*`, `--ds-radius-*`, `--ds-text-size-*`,
`--ds-elevation-*`); `--ds-palette-*` are primitives. The theme follows the system setting; set
`data-theme="light"` or `"dark"` on an element to force one for it and its children. To override
primitives (a brand colour, a tighter spacing scale) for one part of a page, add `ds-theme-scope` to
that element so its semantic tokens follow; if that element also forces a theme, put `data-theme` on
the same element, because CSS can't tell which of several nested `data-theme` ancestors is nearest.

Check a package's provenance with `gh attestation verify <tarball> --owner Reference-Systems-Lab`,
downloading the tarball from its `dist.tarball` URL with your token.

## Developing

You need Node 24 and npm 11. The `.npmrc` is hardened (commerce ADR 0001): a dependency must be a
week old, from the registry, and without install scripts.

```sh
npm ci
npm run check     # build, lint, type-check, test and check every package (Turborepo)
npm run fixture   # install the packed packages in a clean consumer and run every config
```

## Releasing

1. Each pull request that changes a package adds a changeset (`npm run changeset`); CI fails
   without one. A breaking change is a major version. That includes Dependabot pull requests that
   touch a package: add a patch changeset, or `npx changeset add --empty` when the change doesn't
   reach consumers.
2. To release, open a pull request that runs `npm run version-packages`: it bumps the versions,
   writes each package's `CHANGELOG.md` and refreshes the lockfile.
3. Merging it publishes every new version to GitHub Packages, each tarball attested
   (`.github/workflows/release.yml`). While changesets are pending on `main`, nothing publishes.

## Git hooks

Run `.githooks/setup` once after cloning. It turns on the committed hooks, which use
[git-secrets](https://github.com/awslabs/git-secrets#installing-git-secrets) to refuse any commit
that contains a secret.

## Status

The walking skeleton: the tokens and the shared configuration. Components and the documentation site
follow.

## License

[MIT](LICENSE)
