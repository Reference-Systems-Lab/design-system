# 2. The design system's stack

- **Status:** Accepted
- **Date:** 2026-10-09

## Context

The design system supplies the tokens, components, documentation and shared tooling for every
frontend, as versioned packages (README). Its consumers differ: the storefront is server-rendered
Nuxt, checkout is a minimal SPA under a strict content security policy, and admin is a Vue SPA. The
spike (design-system#1) compared monorepo tools, token pipelines, component foundations, styling,
packaging and docs, and decided DS-D1 to DS-D8. The walking skeleton (design-system#2) builds the
first slice: the workspace, the tokens, the shared configuration, a consumer fixture and private
releases. Components, the docs site and the playground come later; this record covers the whole
stack so they follow it.

## Decision

- **Monorepo (DS-D1).** Turborepo on npm workspaces, under the hardened `.npmrc` (DE-2): `apps/*`
  and `packages/*`. No remote cache; telemetry off.
- **Tokens (DS-D2).** DTCG 2025.10 sources built by Terrazzo, with a resolver for the themes. Two
  layers: primitives, and semantic tokens that reference them through `var()`; components read
  semantic tokens only. Light on `:root, [data-theme="light"]`, dark through
  `prefers-color-scheme` unless light is forced, and `[data-theme="dark"]`; `.ds-theme-scope`
  re-declares the semantic layer so a subtree can be re-themed. The first palette is a neutral
  starter, contrast-checked to WCAG AA in both themes (#2 D-2).
- **Components (DS-D3), later.** Two packages: `ui-core`, with no runtime dependencies, for the
  components that need no headless primitives (checkout installs only this), and `ui`, built on
  Reka UI, which it wraps and never re-exports. Strict-CSP consumers use native controls instead of
  the Reka parts that inject styles.
- **Styling (DS-D4).** Plain CSS with `ds-` classes in `@layer ds.tokens, ds.base, ds.components`,
  one stylesheet per component, written as a `.css` file beside the component and imported by it,
  not a `<style>` block, so ESLint's CSS rules cover it (ADR 0001), and authoring rules that keep components safe under a strict CSP: no
  `v-bind()` in styles, no `style` bindings rendered on the server, no injected stylesheets or
  `v-html`, semantic tokens only.
- **Packaging (DS-D5).** ESM only, with an `exports` map per entry and Vue as a peer. Components will
  build with tsdown; the config packages and tokens need no compiler (#2 D-3). Every package is
  checked by publint (and attw where it ships types) and by a consumer fixture that installs the
  packed tarballs.
- **Registry and releases (DS-D8, #2 D-1).** Private packages on GitHub Packages under
  `@reference-systems-lab`, with each consumer repository granted read access. Versions are bumped
  with Changesets in a pull request; every merge to `main` publishes the versions not yet published,
  each tarball with a build-provenance attestation. Consumers check integrity through their lockfile
  and `gh attestation verify`, fetching the tarball from its `dist.tarball` URL with their read
  token (DS-D8).
- **Docs (DS-D6), later.** VitePress with a `/playground` page for live token changes, served at
  `design.rsl-commerce.test`; examples double as test cases instead of a separate workshop app.
- **Quality gates (DS-D7), later with the components.** Vitest Browser Mode with keyboard tests per
  pattern, axe in both themes, a strict-CSP gate under checkout's policy, screenshots in a pinned
  Playwright image, and size budgets.

## Alternatives

- **pnpm, Nx or Lerna** instead of npm workspaces with Turborepo: more features, another tool and
  lockfile format to harden; the system already standardised on npm (DE-2).
- **Style Dictionary** as the token pipeline: mature, but weaker on DTCG's resolver and themes; it
  stays the fallback for formats Terrazzo lacks.
- **PrimeVue, Ark UI or Headless UI** as the component foundation: PrimeVue's current licence forbids
  redistribution as a library; Ark and Headless UI cover less or are Vue-secondary.
- **A utility framework inside components** (Tailwind, UnoCSS): ties every consumer to it and fights
  a strict CSP; a generated Tailwind theme adapter can come later.
- **The public npm registry:** anonymous installs and npm provenance, but this isn't a public
  library (DE-10).
- **A Changesets bot opening release pull requests:** needs Actions permission to open pull requests;
  versioning in the contributor's own pull request needs none (#2 D-1).

## Consequences

- Tokens, configuration and later components ship as separate versioned packages; consumers upgrade
  each on its own schedule.
- Installing any of them needs a read token; each consuming repository must be granted access per
  package.
- Brand colours can replace the starter primitives without renaming a semantic token, so components
  and consumers don't change.
- The pre-1.0 tools (tsdown, VitePress 2 alpha) arrive with the components, pinned exactly and
  behind the consumer fixture.
