// Builds the tokens (design-system ADR 0002, DS-D2): CSS custom properties in @layer ds.tokens, light by
// default, dark through prefers-color-scheme unless light is forced, and data-theme to force either;
// .ds-theme-scope re-declares the semantic layer so a subtree can be re-themed by overriding primitives.
// scripts/emit.mjs then writes tokens.json, tokens.js and tokens.d.ts from Terrazzo's resolved values.
import { defineConfig } from "@terrazzo/cli";
import css from "@terrazzo/plugin-css";
import js from "@terrazzo/plugin-js";

const variableName = (token) => `--ds-${token.id.replaceAll(".", "-")}`;
// The tokens that differ by theme; everything else is declared once, on the light block.
const themed = ["color.*", "elevation.*"];

const indent = (body) =>
  body
    .trim()
    .split("\n")
    .map((line) => `    ${line.trim()}`)
    .join("\n");
const block = (selectors, scheme, body) =>
  `@layer ds.tokens {\n  ${selectors.join(",\n  ")} {\n    color-scheme: ${scheme};\n${indent(body)}\n  }\n}\n`;

export default defineConfig({
  tokens: ["./resolver.json"],
  outDir: "./dist/",
  plugins: [
    css({
      filename: "tokens.css",
      variableName,
      permutations: [
        {
          input: { theme: "light" },
          prepare: (body) => block([":root", '[data-theme="light"]'], "light", body),
        },
        {
          input: { theme: "light" },
          include: themed,
          prepare: (body) => block([".ds-theme-scope"], "light", body),
        },
        {
          input: { theme: "dark" },
          include: themed,
          prepare: (body) =>
            `@media (prefers-color-scheme: dark) {\n${block(
              [
                ':root:not([data-theme="light"])',
                ':root:not([data-theme="light"]) .ds-theme-scope',
              ],
              "dark",
              body,
            )}}\n`,
        },
        {
          input: { theme: "dark" },
          include: themed,
          prepare: (body) =>
            block(['[data-theme="dark"]', '[data-theme="dark"] .ds-theme-scope'], "dark", body),
        },
      ],
    }),
    js({ filename: "terrazzo.js" }),
  ],
});
