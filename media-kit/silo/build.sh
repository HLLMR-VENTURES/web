#!/usr/bin/env bash
# Builds the Silo media kit: SVG masters (committed in masters/) and every PNG export.
# Usage: media-kit/silo/build.sh [OUT_DIR]   (default: media-kit/silo/out, gitignored)
#
# Everything runs in a node:24-bookworm container, so the result does not depend on fonts or tools
# installed on the machine. The fonts are the exact @fontsource-variable packages pinned in the
# repository's package-lock.json, fetched with `npm pack` and checked against the lockfile's
# integrity hash. Nothing is installed into the repository: no npm dependency, no lockfile change.
set -euo pipefail

KIT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO="$(cd "$KIT/../.." && pwd)"
OUT="${1:-$KIT/out}"
mkdir -p "$OUT"
OUT="$(cd "$OUT" && pwd)"

# Git Bash on Windows rewrites /paths in arguments; keep docker's paths as written.
export MSYS_NO_PATHCONV=1

docker run --rm \
  -v "$REPO:/repo:ro" \
  -v "$OUT:/out" \
  -w /work \
  node:24-bookworm bash -euo pipefail -c '
    apt-get update -qq >/dev/null
    apt-get install -y -qq --no-install-recommends python3-fonttools python3-brotli libharfbuzz-bin librsvg2-bin >/dev/null
    for pkg in @fontsource-variable/fraunces @fontsource-variable/hanken-grotesk; do
      read -r ver want < <(node -e "const p=require(\"/repo/package-lock.json\").packages[\"node_modules/$pkg\"]; console.log(p.version, p.integrity)")
      file=$(npm pack --silent "$pkg@$ver")
      got="sha512-$(openssl dgst -sha512 -binary "$file" | base64 -w0)"
      [ "$got" = "$want" ] || { echo "integrity mismatch for $pkg@$ver" >&2; exit 1; }
      mkdir -p "fonts/$pkg" && tar -xzf "$file" -C "fonts/$pkg" --strip-components=1
      echo "font: $pkg@$ver ($want)"
    done
    echo "tools: $(hb-shape --version | head -1); rsvg-convert $(rsvg-convert --version | cut -d" " -f3); fontTools $(python3 -c "import fontTools; print(fontTools.version)")"
    python3 /repo/media-kit/silo/generate.py /repo /work/fonts /out
    chown -R "$(stat -c %u:%g /out)" /out
  '

# The SVG masters are sources: keep the committed copies in step with the build.
rm -f "$KIT"/masters/*.svg
mkdir -p "$KIT/masters"
cp "$OUT"/masters/*.svg "$KIT/masters/"
echo "built: $OUT"
