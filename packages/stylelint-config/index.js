// The shared Stylelint config (design-system ADR 0001): the standard rules for CSS and Vue files, and no
// raw colour values, because styling flows from tokens (AGENTS.md). Use var(--ds-…) from
// @reference-systems-lab/tokens instead. In a consumer's stylelint.config.js:
//   export default { extends: ["@reference-systems-lab/stylelint-config"] };
/** @type {import("stylelint").Config} */
export default {
  extends: ["stylelint-config-standard-vue"],
  rules: {
    "color-no-hex": [true, { message: "Use a colour token, var(--ds-color-…), not a hex value" }],
    "color-named": [
      "never",
      { message: "Use a colour token, var(--ds-color-…), not a named colour" },
    ],
    "function-disallowed-list": [
      ["rgb", "rgba", "hsl", "hsla", "hwb", "lab", "lch", "oklab", "oklch", "color"],
      { message: "Use a colour token, var(--ds-color-…), not a colour function" },
    ],
  },
};
