// REQ-003: the documented colour pairs meet WCAG 2.2 AA in both themes (design-system#2 D-2, D-7).
import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

const themes = JSON.parse(await readFile(new URL("../dist/tokens.json", import.meta.url), "utf8"));

// WCAG 2.2 relative luminance and contrast ratio (https://www.w3.org/TR/WCAG22/#dfn-relative-luminance).
const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};
export const ratio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

// [foreground, background, minimum]: 4.5 for text, 3 for UI components and focus indicators.
export const pairs = [
  ...["color.bg", "color.surface"].flatMap((bg) => [
    ["color.text", bg, 4.5],
    ["color.text-muted", bg, 4.5],
    ["color.accent", bg, 4.5],
    ["color.success", bg, 4.5],
    ["color.warning", bg, 4.5],
    ["color.danger", bg, 4.5],
    ["color.border-strong", bg, 3],
    ["color.focus-ring", bg, 3],
  ]),
  ["color.on-accent", "color.accent", 4.5],
];

describe.each(Object.keys(themes))("%s theme", (theme) => {
  it.each(pairs)("%s on %s reaches %s:1", (fg, bg, min) => {
    const r = ratio(themes[theme][fg], themes[theme][bg]);
    expect(
      r,
      `${fg} on ${bg} in ${theme}: ${r.toFixed(2)}:1, needs ${min}:1`,
    ).toBeGreaterThanOrEqual(min);
  });
});
