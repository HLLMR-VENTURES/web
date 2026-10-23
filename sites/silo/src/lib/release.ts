/**
 * The latest Silo app release, read once at build time from the public GitHub API, so visitors'
 * browsers never call GitHub for it. Fails soft: offline or rate-limited builds get `null`, and
 * pages fall back to the Releases page. CI passes GITHUB_TOKEN to lift the anonymous rate limit.
 * The release id of the site artifact is content-addressed, so a new app version (new links and
 * version text) produces a new site release, and an unchanged one does not.
 */
import { LINKS, SILO_REPO, SILO_REPO_URLS } from "./site";

export interface AppAsset {
  name: string;
  url: string;
  size: number;
  /** From the release's SHA256SUMS.txt, when it lists this file. */
  sha256?: string;
}

export interface AppRelease {
  /** e.g. "0.11.0" */
  version: string;
  /** YYYY-MM-DD */
  date: string;
  pageUrl: string;
  /** Recommended Windows installer (per-user setup .exe), when the release carries one. */
  windowsSetup: AppAsset | null;
  windowsMsi: AppAsset | null;
  macArm: AppAsset | null;
  macIntel: AppAsset | null;
  linuxAppImage: AppAsset | null;
  linuxDeb: AppAsset | null;
  linuxRpm: AppAsset | null;
  /** The checksum file itself, for people who verify with their own tools. */
  sums: AppAsset | null;
}

const API = `https://api.github.com/repos/${SILO_REPO}/releases/latest`;
let cached: Promise<AppRelease | null> | undefined;

/** @returns the latest published (non-draft, non-prerelease) release, or null */
export function latestRelease(): Promise<AppRelease | null> {
  cached ??= load();
  return cached;
}

async function load(): Promise<AppRelease | null> {
  if (process.env.SILO_OFFLINE === "1") return null;
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "User-Agent": "hllmr-web-build",
    };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    const res = await fetch(API, { headers, signal: AbortSignal.timeout(10_000) });
    if (!res.ok) throw new Error(`GitHub ${res.status}`);
    const r = (await res.json()) as {
      tag_name: string;
      published_at: string;
      html_url: string;
      assets: { name: string; browser_download_url: string; size: number }[];
    };
    const version = r.tag_name.replace(/^v/, "");
    if (!/^\d+\.\d+\.\d+$/.test(version)) throw new Error(`unexpected tag ${r.tag_name}`);
    const pageUrl = SILO_REPO_URLS.some((p) => r.html_url.startsWith(`${p}releases/`)) ? r.html_url : LINKS.releases;
    const pick = (re: RegExp): AppAsset | null => {
      const a = r.assets.find((x) => re.test(x.name));
      if (!a || !SILO_REPO_URLS.some((p) => a.browser_download_url.startsWith(`${p}releases/download/`))) return null;
      return { name: a.name, url: a.browser_download_url, size: a.size };
    };
    const sums = pick(/^SHA256SUMS\.txt$/);
    const hashes = new Map<string, string>();
    if (sums) {
      try {
        const t = await (await fetch(sums.url, { headers: { "User-Agent": "hllmr-web-build" }, signal: AbortSignal.timeout(10_000) })).text();
        for (const line of t.split(/\r?\n/)) {
          const m = line.match(/^([0-9a-f]{64})\s+\*?(\S+)$/);
          if (m) hashes.set(m[2], m[1]);
        }
      } catch {
        /* checksums are optional on the page; the file stays linked */
      }
    }
    const withSum = (a: AppAsset | null): AppAsset | null => (a ? { ...a, sha256: hashes.get(a.name) } : null);
    return {
      version,
      date: r.published_at.slice(0, 10),
      pageUrl,
      windowsSetup: withSum(pick(/_x64-setup\.exe$/i)),
      windowsMsi: withSum(pick(/_x64_en-US\.msi$/i)),
      macArm: withSum(pick(/_aarch64\.dmg$/i)),
      macIntel: withSum(pick(/_x64\.dmg$/i)),
      linuxAppImage: withSum(pick(/\.AppImage$/i)),
      linuxDeb: withSum(pick(/\.deb$/i)),
      linuxRpm: withSum(pick(/\.rpm$/i)),
      sums,
    };
  } catch (e) {
    console.warn(`[release] latest app release unavailable, using the Releases page: ${(e as Error).message}`);
    return null;
  }
}

/**
 * @param bytes - file size
 * @returns a short human size such as "12 MB"
 */
export function formatSize(bytes: number): string {
  return `${Math.max(1, Math.round(bytes / 1_000_000))} MB`;
}
