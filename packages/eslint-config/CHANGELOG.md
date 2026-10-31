# @reference-systems-lab/eslint-config

## 0.2.0

### Minor Changes

- f991ad8: A Nuxt variant of the ESLint config, `@reference-systems-lab/eslint-config/nuxt`, which ignores Nuxt's
  generated folders, leaves auto-imported names to vue-tsc, and accepts pages and layouts named after
  their files. The base config now fails `v-html` and `console` calls, and ignores Playwright's
  reports. `vue-app.json` turns on vue-tsc's strict templates, allowing `data-*` attributes.

### Patch Changes

- f6fa836: Requires `@eslint/css` ^2.0.1, `eslint-plugin-vuejs-accessibility` ^2.6.2 and `typescript-eslint`
  ^8.71.2, the patch releases of the lint dependencies.

## 0.1.0

### Minor Changes

- 87c321e: First release: the design tokens (a neutral starter palette, light and dark, contrast-checked to WCAG AA) and the shared ESLint (with CSS), Prettier and TypeScript configs.
