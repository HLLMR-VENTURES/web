#!/usr/bin/env bash
# Runs the URL contract against the real nginx image with the proposed site config, laid out the
# way the host does it: www/releases/<sha>/, a relative current -> releases/<sha> symlink and
# www/runtime/metrics.json. Needs Docker (CI ubuntu runners have it).
#   tests/url-contract/run-nginx.sh [dist-dir]
# Env: CONTRACT_STRICT=1 to fail on pending entries (release workflow).
set -euo pipefail

# Pinned image: tag + digest (nginx stable, unprivileged, port 8080). Infra re-resolves the digest
# for the host at the Inspected stage; keep the two in step.
IMAGE="nginxinc/nginx-unprivileged:1.30.6-alpine@sha256:782bb89768cc87b7f95c18b95baa1af250e5d451f26794f59363540161147c01"

repo="$(cd "$(dirname "$0")/../.." && pwd)"
dist="${1:-$repo/sites/silo/dist}"
[ -f "$dist/index.html" ] || { echo "no build at $dist" >&2; exit 1; }

work="$(mktemp -d)"
name="silo-contract-$$"
cleanup() { docker rm -f "$name" >/dev/null 2>&1 || true; rm -rf "$work"; }
trap cleanup EXIT

sha="0000000000000000000000000000000000000000"
mkdir -p "$work/www/releases" "$work/www/runtime" "$work/silo"
cp -R "$dist" "$work/www/releases/$sha"
ln -s "releases/$sha" "$work/www/current"
cp "$repo/tests/fixtures/runtime/metrics.json" "$work/www/runtime/metrics.json"
cp "$repo/deploy/silo/security-headers.conf" "$repo/deploy/silo/redirects.conf" "$work/silo/"
chmod -R a+rX "$work"

docker run -d --name "$name" -p 127.0.0.1:18080:8080 --read-only --tmpfs /tmp \
  -v "$work/www:/srv/www:ro" \
  -v "$repo/deploy/silo/nginx.conf:/etc/nginx/conf.d/default.conf:ro" \
  -v "$work/silo:/etc/nginx/silo:ro" \
  "$IMAGE" >/dev/null

docker exec "$name" nginx -t
for _ in $(seq 1 30); do
  curl -fsS http://127.0.0.1:18080/healthz >/dev/null 2>&1 && break
  sleep 1
done

# Header spot checks that the model cannot cover.
headers="$(curl -sSI http://127.0.0.1:18080/)"
grep -qi '^content-security-policy: frame-ancestors' <<<"$headers" || { echo "missing CSP header" >&2; exit 1; }
grep -qi '^cache-control: no-cache' <<<"$headers" || { echo "HTML must be Cache-Control: no-cache" >&2; exit 1; }
asset="$(cd "$dist" && ls _astro/*.css | head -n1)"
curl -sSI "http://127.0.0.1:18080/$asset" | grep -qi 'immutable' || { echo "hashed assets must be immutable" >&2; exit 1; }
[ "$(curl -s -o /dev/null -w '%{http_code}' -X POST http://127.0.0.1:18080/)" = "405" ] || { echo "POST must be 405" >&2; exit 1; }

CONTRACT_BASE_URL="http://127.0.0.1:18080" node --test "$repo/tests/url-contract/contract.test.mjs"
