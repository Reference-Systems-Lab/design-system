// The shared ESLint flat config (design-system ADR 0001): JavaScript recommended, typescript-eslint's
// type-checked rules, Vue's recommended rules with TypeScript in <script lang="ts">, the Vue
// accessibility rules, and CSS through @eslint/css with colours only from tokens; the formatting rules
// that Prettier owns are switched off. CSS lives in .css files (a component imports its own), because
// @eslint/css can't read <style> blocks, so .vue files may not have one. In a consumer's eslint.config.js:
//
//   import config from "@reference-systems-lab/eslint-config";
//   export default [...config, { languageOptions: { parserOptions: { tsconfigRootDir: import.meta.dirname } } }];
import css from "@eslint/css";
import js from "@eslint/js";
import prettier from "eslint-config-prettier/flat";
import vue from "eslint-plugin-vue";
import vueA11y from "eslint-plugin-vuejs-accessibility";
import globals from "globals";
import tseslint from "typescript-eslint";

const scripts = ["**/*.{js,mjs,cjs,ts,mts,cts,vue}"];
// Styling flows from tokens (AGENTS.md): no literal colours, only var(--ds-color-…).
const tokenColoursOnly = [
  { selector: "Hash", message: "Use a colour token, var(--ds-color-…), not a hex value." },
  {
    selector: "Function[name=/^(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color|color-mix)$/i]",
    message: "Use a colour token, var(--ds-color-…), not a colour function.",
  },
  {
    selector:
      "Declaration Identifier[name=/^(black|white|red|green|blue|yellow|orange|purple|pink|brown|gray|grey|cyan|magenta|lime|navy|teal|olive|maroon|silver|gold|indigo|violet|aqua|fuchsia|crimson|coral|salmon|tomato|khaki|beige|tan|ivory|lavender|turquoise)$/i]",
    message: "Use a colour token, var(--ds-color-…), not a named colour.",
  },
];

const scoped = (configs) => configs.map((config) => ({ files: scripts, ...config }));

export default [
  { ignores: ["**/dist/**", "**/coverage/**", "**/.turbo/**"] },
  ...scoped([
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
  ]),
  {
    files: ["**/*.vue"],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
    rules: {
      "vue/no-restricted-block": [
        "error",
        {
          element: "style",
          message:
            "Put the styles in a .css file beside the component and import it; @eslint/css lints .css files only.",
        },
      ],
    },
  },
  // Plain JavaScript (config files, scripts) isn't type-checked.
  { files: ["**/*.{js,mjs,cjs}"], ...tseslint.configs.disableTypeChecked },
  // Last for scripts: Prettier owns formatting, so the formatting rules above (Vue's template layout
  // among them) are off.
  { files: scripts, ...prettier },
  {
    files: ["**/*.css"],
    plugins: { css },
    language: "css/css",
    rules: {
      ...css.configs.recommended.rules,
      // Tokens are defined in another stylesheet, so their names can't be checked from here.
      "css/no-invalid-properties": ["error", { allowUnknownVariables: true }],
      "no-restricted-syntax": ["error", ...tokenColoursOnly],
    },
  },
];
