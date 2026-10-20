#!/usr/bin/env bash
# Runs a division site's URL contract (ADR-0015) against the real nginx image with its proposed
# config, laid out the way the host does it: www/releases/<id>/ and a relative current symlink.
# Needs Docker (CI ubuntu runners have it). Same image as run-nginx-hllmr.sh; keep them in step.
#   tests/url-contract/run-nginx-family.sh <tools|upgrade|live|gaming> [dist-dir]
set -euo pipefail

IMAGE="nginxinc/nginx-unprivileged:1.30.6-alpine@sha256:782bb89768cc87b7f95c18b95baa1af250e5d451f26794f59363540161147c01"

site="${1:?usage: run-nginx-family.sh <site> [dist-dir]}"
case "$site" in
  tools) port=18091 ;;
  upgrade) port=18092 ;;
  live) port=18093 ;;
  gaming) port=18094 ;;
  *) echo "unknown site: $site" >&2; exit 2 ;;
esac

repo="$(cd "$(dirname "$0")/../.." && pwd)"
dist="${2:-$repo/sites/$site/dist}"
[ -f "$dist/index.html" ] || { echo "no build at $dist" >&2; exit 1; }

work="$(mktemp -d)"
name="$site-contract-$$"
cleanup() { docker rm -f "$name" >/dev/null 2>&1 || true; rm -rf "$work"; }
trap cleanup EXIT

id="0000000000000000000000000000000000000000"
mkdir -p "$work/www/releases" "$work/conf"
cp -R "$dist" "$work/www/releases/$id"
ln -s "releases/$id" "$work/www/current"
cp "$repo/deploy/$site/security-headers.conf" "$work/conf/"
chmod -R a+rX "$work"

docker run -d --name "$name" -p "127.0.0.1:$port:8080" --read-only --tmpfs /tmp \
  -v "$work/www:/srv/www:ro" \
  -v "$repo/deploy/$site/nginx.conf:/etc/nginx/conf.d/default.conf:ro" \
  -v "$work/conf:/etc/nginx/$site:ro" \
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
if grep -qi '^strict-transport-security' <<<"$headers"; then echo "HSTS must not be sent (owner decision, per host)" >&2; exit 1; fi
asset="$(cd "$dist" && ls _astro/*.css | head -n1)"
curl -sSI "http://127.0.0.1:$port/$asset" | grep -qi 'immutable' || { echo "hashed assets must be immutable" >&2; exit 1; }
[ "$(curl -s -o /dev/null -w '%{http_code}' -X POST "http://127.0.0.1:$port/")" = "405" ] || { echo "POST must be 405" >&2; exit 1; }

CONTRACT_BASE_URL="http://127.0.0.1:$port" node --test "$repo/tests/url-contract/$site.contract.mjs"
