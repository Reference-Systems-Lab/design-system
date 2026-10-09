// The shared Prettier config (design-system ADR 0001). In a consumer's package.json:
//   "prettier": "@reference-systems-lab/prettier-config"
/** @type {import("prettier").Config} */
export default {
  printWidth: 100,
};
