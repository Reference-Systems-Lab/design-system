---
"@reference-systems-lab/tokens": patch
---

The `elevation` shadows in `tokens.css` leave out their zero spread, as Terrazzo 2.9 writes them:
`0px 1px 2px var(--ds-palette-shadow-light)` instead of `0px 1px 2px 0px …`. They render the same.
