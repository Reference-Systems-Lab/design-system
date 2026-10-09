#!/bin/sh
# The consumer fixture (REQ-006, D-6): packs every publishable package, installs the tarballs into a
# temporary copy of apps/consumer-fixture (not workspace links), and runs each shared config there, then
# a Vite build whose CSS must carry the tokens. FIXTURE_PLANT=lint|format|style|vue-style|type adds one violation,
# to prove the matching tool fails.
set -eu
root=$(cd "$(dirname "$0")/.." && pwd)
work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

echo "fixture: build and pack the packages"
(cd "$root" && TURBO_TELEMETRY_DISABLED=1 npx turbo run build --output-logs=errors-only)
mkdir "$work/packs"
for dir in "$root"/packages/*/; do
  [ -f "$dir/package.json" ] || continue
  (cd "$dir" && npm pack --silent --pack-destination "$work/packs" >/dev/null)
done

echo "fixture: install the tarballs into a clean copy"
mkdir "$work/app"
(cd "$root/apps/consumer-fixture" && tar --exclude=node_modules --exclude=dist -cf - .) | (cd "$work/app" && tar -xf -)
cp "$root/.npmrc" "$work/app/.npmrc"
cd "$work/app"
node --input-type=module -e '
  import { readFileSync, readdirSync, writeFileSync } from "node:fs";
  const pkg = JSON.parse(readFileSync("package.template.json", "utf8"));
  for (const file of readdirSync("../packs")) {
    const name = "@reference-systems-lab/" + file.replace(/^reference-systems-lab-/, "").replace(/-\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?\.tgz$/, "");
    pkg.devDependencies[name] = "file:../packs/" + file;
  }
  writeFileSync("package.json", JSON.stringify(pkg, null, 2) + "\n");
'
npm install --no-audit --no-fund --loglevel=error

case ${FIXTURE_PLANT:-} in
  "") ;;
  lint) printf 'export function plant(): number {\n  let unused = 1;\n  return 2;\n}\n' >src/plant.ts ;;
  format) printf 'export const plant   =  1\n' >src/plant.ts ;;
  style) printf '.plant {\n  color: #ff0000;\n}\n' >src/plant.css ;;
  vue-style) printf '<template>\n  <p>plant</p>\n</template>\n\n<style>\n.plant {\n  margin: 0;\n}\n</style>\n' >src/PlantBlock.vue ;;
  type) printf 'export const plant: number = "one";\n' >src/plant.ts ;;
  *) echo "error: FIXTURE_PLANT must be lint, format, style, vue-style or type" >&2; exit 2 ;;
esac

echo "fixture: eslint (scripts, Vue and CSS)"; npx eslint --max-warnings 0 .
echo "fixture: prettier";  npx prettier --check src
echo "fixture: vue-tsc";   npx vue-tsc --noEmit
echo "fixture: vite build"; npx vite build --logLevel warn

echo "fixture: the built CSS carries the tokens, light and dark"
css=$(cat dist/assets/*.css)
for want in "@layer ds.tokens" "--ds-color-accent" "prefers-color-scheme:dark" "data-theme=dark"; do
  printf '%s' "$css" | grep -qF -- "$want" || { echo "error: built CSS lacks $want" >&2; exit 1; }
done
echo "fixture: ok"
