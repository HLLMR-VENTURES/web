#!/usr/bin/env bash
# Packs a built site into the release artifact the host release tool expects.
#
# The release id is CONTENT-ADDRESSED: the first 40 hex of sha256(SHA256SUMS). The same commit can
# build different content (build-time release data, catalog snapshot), so the commit sha alone
# cannot name a release; identical content always gets the same id, so a rebuild with no change is
# detected and not republished. The id matches the release tool's ^[0-9a-f]{40}$ check; the commit
# is recorded in ARTIFACT.json and the release notes.
#
# Outputs in <out-dir>:
#   site-<id>.tar.gz   servable files only, deterministic (sorted, root-owned, fixed mtime, gzip -n)
#   SHA256SUMS         one "<sha256>  <path>" line per file, paths relative to the site root
#   ARTIFACT.json      id, commit, both checksums and sizes (for the release notes and approval line)
# Usage: scripts/make-artifact.sh <dist-dir> <40-hex-commit-sha> <out-dir>   (GNU tar; CI only)
set -euo pipefail

dist="$1" commit="$2" out="$3"
[[ "$commit" =~ ^[0-9a-f]{40}$ ]] || { echo "commit must be 40 lowercase hex" >&2; exit 1; }
[ -f "$dist/index.html" ] || { echo "no index.html in $dist" >&2; exit 1; }
mkdir -p "$out"
out="$(cd "$out" && pwd)"

# Refuse anything the release tool would refuse, before packing.
if find "$dist" ! -type f ! -type d | grep -q .; then echo "non-regular files in $dist" >&2; exit 1; fi
if (cd "$dist" && find . -mindepth 1 | sed 's#^\./##' | grep -Ev '^([A-Za-z0-9._-]+/)*[A-Za-z0-9._-]+$' | grep -q .); then
  echo "unsafe path names in $dist" >&2; exit 1
fi
if (cd "$dist" && find . -mindepth 1 | sed 's#^\./##' | grep -Eq '(^|/)\.'); then echo "dot paths in $dist" >&2; exit 1; fi
if find "$dist" -name '*.map' | grep -q .; then echo "source maps in $dist" >&2; exit 1; fi

(cd "$dist" && find . -type f | sed 's#^\./##' | LC_ALL=C sort | xargs -d '\n' sha256sum) >"$out/SHA256SUMS"
mf_sum="$(sha256sum "$out/SHA256SUMS" | cut -d' ' -f1)"
id="${mf_sum:0:40}"

epoch="${SOURCE_DATE_EPOCH:-$(git log -1 --format=%ct "$commit")}"
(cd "$dist" && tar --sort=name --owner=0 --group=0 --numeric-owner --mtime="@${epoch}" \
  --format=gnu -cf - .) | gzip -n -9 >"$out/site-${id}.tar.gz"

tb_sum="$(sha256sum "$out/site-${id}.tar.gz" | cut -d' ' -f1)"
files="$(wc -l <"$out/SHA256SUMS" | tr -d ' ')"
bytes="$(du -sb "$dist" | cut -f1)"
cat >"$out/ARTIFACT.json" <<EOF
{
  "site": "silo",
  "id": "${id}",
  "commit": "${commit}",
  "tarball": "site-${id}.tar.gz",
  "tarballSha256": "${tb_sum}",
  "manifestSha256": "${mf_sum}",
  "files": ${files},
  "unpackedBytes": ${bytes},
  "sourceDateEpoch": ${epoch}
}
EOF
echo "id=${id}" >>"${GITHUB_OUTPUT:-/dev/null}"
echo "artifact: site-${id}.tar.gz (${files} files, tarball ${tb_sum}, manifest ${mf_sum}, commit ${commit})"
