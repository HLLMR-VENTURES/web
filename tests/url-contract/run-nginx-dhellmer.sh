#!/usr/bin/env bash
# Runs the dhellmer.com URL contract against the real nginx image with the proposed site config, laid
# out the way the host does it: www/releases/<id>/ and a relative current -> releases/<id> symlink.
# Needs Docker (CI ubuntu runners have it). Same image as run-nginx.sh (Silo) and run-nginx-hllmr.sh; keep them in step.
#   tests/url-contract/run-nginx-dhellmer.sh [dist-dir]
set -euo pipefail

IMAGE="nginxinc/nginx-unprivileged:1.30.6-alpine@sha256:782bb89768cc87b7f95c18b95baa1af250e5d451f26794f59363540161147c01"

repo="$(cd "$(dirname "$0")/../.." && pwd)"
dist="${1:-$repo/sites/dhellmer/dist}"
[ -f "$dist/index.html" ] || { echo "no build at $dist" >&2; exit 1; }

work="$(mktemp -d)"
name="dhellmer-contract-$$"
port=18082
cleanup() { docker rm -f "$name" >/dev/null 2>&1 || true; rm -rf "$work"; }
trap cleanup EXIT

id="0000000000000000000000000000000000000000"
mkdir -p "$work/www/releases" "$work/dhellmer"
cp -R "$dist" "$work/www/releases/$id"
ln -s "releases/$id" "$work/www/current"
cp "$repo/deploy/dhellmer/security-headers.conf" "$work/dhellmer/"
chmod -R a+rX "$work"

docker run -d --name "$name" -p "127.0.0.1:$port:8080" --read-only --tmpfs /tmp \
  -v "$work/www:/srv/www:ro" \
  -v "$repo/deploy/dhellmer/nginx.conf:/etc/nginx/conf.d/default.conf:ro" \
  -v "$work/dhellmer:/etc/nginx/dhellmer:ro" \
  "$IMAGE" >/dev/null

docker exec "$name" nginx -t
for _ in $(seq 1 30); do
  curl -fsS "http://127.0.0.1:$port/healthz" >/dev/null 2>&1 && break
  sleep 1
done

# Header spot checks that the model cannot cover.
headers="$(curl -sSI "http://127.0.0.1:$port/")"
grep -qi '^content-security-policy: frame-ancestors' <<<"$headers" || { echo "missing CSP header" >&2; exit 1; }
grep -qi '^cache-control: no-cache' <<<"$headers" || { echo "HTML must be Cache-Control: no-cache" >&2; exit 1; }
if grep -qi '^strict-transport-security' <<<"$headers"; then echo "HSTS must not be sent (owner decision pending)" >&2; exit 1; fi
asset="$(cd "$dist" && ls _astro/*.css | head -n1)"
curl -sSI "http://127.0.0.1:$port/$asset" | grep -qi 'immutable' || { echo "hashed assets must be immutable" >&2; exit 1; }
[ "$(curl -s -o /dev/null -w '%{http_code}' -X POST "http://127.0.0.1:$port/")" = "405" ] || { echo "POST must be 405" >&2; exit 1; }

CONTRACT_BASE_URL="http://127.0.0.1:$port" node --test "$repo/tests/url-contract/dhellmer.contract.mjs"
