// The shared ESLint config for a Nuxt app (design-system#8): the base config (index.js), plus what
// Nuxt's conventions need. In a Nuxt app's eslint.config.js:
//
//   import config from "@reference-systems-lab/eslint-config/nuxt";
//   export default [...config, { languageOptions: { parserOptions: { tsconfigRootDir: import.meta.dirname } } }];
//
// Run `nuxt prepare` first, so the type-checked rules see the types Nuxt generates in .nuxt/.
import base from "./index.js";

export default [
  // Nuxt's generated types, its build output and its local data.
  { ignores: ["**/.nuxt/**", "**/.output/**", "**/.data/**"] },
  ...base,
  // Nuxt auto-imports composables and components; vue-tsc checks those names instead.
  { files: ["**/*.vue"], rules: { "no-undef": "off" } },
  // Nuxt names the app, the error page, pages and layouts after their files.
  {
    files: ["**/app.vue", "**/error.vue", "**/pages/**/*.vue", "**/layouts/**/*.vue"],
    rules: { "vue/multi-word-component-names": "off" },
  },
];
