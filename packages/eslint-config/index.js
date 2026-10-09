// The shared ESLint flat config (design-system ADR 0001): JavaScript recommended, typescript-eslint's
// type-checked rules, Vue's recommended rules with TypeScript in <script lang="ts">, and the Vue
// accessibility rules. In a consumer's eslint.config.js:
//
//   import config from "@reference-systems-lab/eslint-config";
//   export default [...config, { languageOptions: { parserOptions: { tsconfigRootDir: import.meta.dirname } } }];
import js from "@eslint/js";
import vue from "eslint-plugin-vue";
import vueA11y from "eslint-plugin-vuejs-accessibility";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  { ignores: ["**/dist/**", "**/coverage/**", "**/.turbo/**"] },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...vue.configs["flat/recommended"],
  ...vueA11y.configs["flat/recommended"],
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { projectService: true, extraFileExtensions: [".vue"] },
    },
  },
  {
    files: ["**/*.vue"],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
  },
  // Plain JavaScript (config files, scripts) isn't type-checked.
  { files: ["**/*.{js,mjs,cjs}"], ...tseslint.configs.disableTypeChecked },
];
