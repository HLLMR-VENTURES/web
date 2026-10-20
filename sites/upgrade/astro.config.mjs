// upgrade.hllmr.com build configuration (HLLMR UPGRADE, ADR-0015). Static output only: no adapter, no
// SSR server, no islands. Same shape as sites/hllmr/astro.config.mjs.
import { defineConfig } from "astro/config";

/** The one build-time origin; every absolute URL the site emits derives from it. Bare origin only. */
const SITE_URL = process.env.SITE_URL ?? "https://upgrade.hllmr.com";
const parsed = new URL(SITE_URL);
if (parsed.origin !== SITE_URL) {
  throw new Error(`SITE_URL must be a bare origin like https://upgrade.hllmr.com (got ${SITE_URL})`);
}

export default defineConfig({
  site: SITE_URL,
  output: "static",
  build: {
    format: "preserve",
    inlineStylesheets: "never",
    assets: "_astro",
  },
  trailingSlash: "ignore",
  compressHTML: true,
  markdown: { syntaxHighlight: false },
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
  },
  security: {
    // Per-page <meta> CSP with hashes for what Astro renders; frame-ancestors and friends come from
    // deploy/upgrade/security-headers.conf. The site fetches nothing at runtime.
    csp: {
      directives: [
        "default-src 'self'",
        "connect-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "object-src 'none'",
        "base-uri 'none'",
        "form-action 'none'",
      ],
    },
  },
});
