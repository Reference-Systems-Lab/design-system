# @reference-systems-lab/eslint-config

## 0.2.1

### Patch Changes

- 34b7d6f: Requires `eslint-plugin-vue` ^10.12.1, `typescript-eslint` ^8.72.2 and `vue-eslint-parser` ^10.4.2,
  the current releases of the lint dependencies.
- 742d6d6: Requires `eslint-plugin-vue` ^10.12.0, `eslint-plugin-vuejs-accessibility` ^2.6.3, `globals` ^17.14.0
  and `typescript-eslint` ^8.72.1, the current releases of the lint dependencies.

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
