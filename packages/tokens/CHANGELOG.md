# @reference-systems-lab/tokens

## 0.1.1

### Patch Changes

- 9e6ae1a: The `elevation` shadows in `tokens.css` leave out their zero spread, as Terrazzo 2.9 writes them:
  `0px 1px 2px var(--ds-palette-shadow-light)` instead of `0px 1px 2px 0px …`. They render the same.

## 0.1.0

### Minor Changes

- 87c321e: First release: the design tokens (a neutral starter palette, light and dark, contrast-checked to WCAG AA) and the shared ESLint (with CSS), Prettier and TypeScript configs.
