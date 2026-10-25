---
"@reference-systems-lab/eslint-config": minor
"@reference-systems-lab/tsconfig": minor
---

A Nuxt variant of the ESLint config, `@reference-systems-lab/eslint-config/nuxt`, which ignores Nuxt's
generated folders, leaves auto-imported names to vue-tsc, and accepts pages and layouts named after
their files. The base config now fails `v-html` and `console` calls, and ignores Playwright's
reports. `vue-app.json` turns on vue-tsc's strict templates, allowing `data-*` attributes.
