/**
 * The latest Silo app release, read once at build time from the public GitHub API, so visitors'
 * browsers never call GitHub for it. Fails soft: offline or rate-limited builds get `null`, and
 * pages fall back to the Releases page. CI passes GITHUB_TOKEN to lift the anonymous rate limit.
 * The release id of the site artifact is content-addressed, so a new app version (new links and
 * version text) produces a new site release, and an unchanged one does not.
 */
import { LINKS } from "./site";

export interface AppAsset {
  name: string;
  url: string;
  size: number;
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
}

const API = "https://api.github.com/repos/HLLMR/silo/releases/latest";
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
    const pageUrl = r.html_url.startsWith(`${LINKS.releases}/`) ? r.html_url : LINKS.releases;
    const pick = (re: RegExp): AppAsset | null => {
      const a = r.assets.find((x) => re.test(x.name));
      if (!a || !a.browser_download_url.startsWith("https://github.com/HLLMR/silo/releases/download/")) return null;
      return { name: a.name, url: a.browser_download_url, size: a.size };
    };
    return {
      version,
      date: r.published_at.slice(0, 10),
      pageUrl,
      windowsSetup: pick(/_x64-setup\.exe$/i),
      windowsMsi: pick(/_x64_en-US\.msi$/i),
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
