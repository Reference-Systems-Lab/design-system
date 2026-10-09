// REQ-002: the shape of dist/tokens.css (design-system ADR 0002, DS-D2).
import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

const css = await readFile(new URL("../dist/tokens.css", import.meta.url), "utf8");
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, "");
const body = strip(css);

describe("tokens.css", () => {
  it("declares every custom property inside @layer ds.tokens", () => {
    const outside = body.replace(/@layer ds\.tokens \{[\s\S]*?\n\}\n/g, "").replace(/@media[^{]*\{\s*\}/g, "");
    expect(outside).not.toMatch(/--ds-/);
    expect(body).toMatch(/@layer ds\.tokens \{/);
  });

  it("orders the themes: light, the scope, dark by preference unless light is forced, then dark by attribute", () => {
    const at = (s) => body.indexOf(s);
    const light = at(':root,\n  [data-theme="light"] {');
    const scope = at("  .ds-theme-scope {");
    const media = at("@media (prefers-color-scheme: dark) {");
    const mediaSel = at(':root:not([data-theme="light"]),\n  :root:not([data-theme="light"]) .ds-theme-scope {');
    const attr = at('[data-theme="dark"],\n  [data-theme="dark"] .ds-theme-scope {');
    for (const i of [light, scope, media, mediaSel, attr]) expect(i).toBeGreaterThan(-1);
    expect(light).toBeLessThan(scope);
    expect(scope).toBeLessThan(media);
    expect(media).toBeLessThan(mediaSel);
    expect(mediaSel).toBeLessThan(attr);
  });

  it("makes every semantic colour and elevation a var() of a primitive", () => {
    const semantic = [...body.matchAll(/--ds-(color|elevation)-[\w-]+:\s*([^;]+);/g)];
    expect(semantic.length).toBeGreaterThan(0);
    for (const [decl, , value] of semantic) expect(value, decl).toMatch(/var\(--ds-palette-[\w-]+\)/);
  });

  it("declares primitives once, on the light block only", () => {
    expect(body.match(/--ds-palette-gray-900:/g)).toHaveLength(1);
  });

  it("covers the semantic set", async () => {
    const { tokens } = await import("../dist/tokens.js");
    const ids = Object.keys(tokens.light);
    for (const id of [
      "color.bg", "color.surface", "color.text", "color.text-muted", "color.border", "color.border-strong",
      "color.accent", "color.on-accent", "color.success", "color.warning", "color.danger", "color.focus-ring",
      "text-size.body", "space.inset", "radius.control", "elevation.1", "focus-width",
    ]) expect(ids).toContain(id);
    expect(Object.keys(tokens.dark)).toEqual(ids);
  });
});
