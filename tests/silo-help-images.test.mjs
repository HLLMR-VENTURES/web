// The post-build Help screenshot rewrite (sites/silo/src/lib/help-images.mjs): right-sized `sizes`
// and a full-size link around every Markdown screenshot, nothing else touched.
import { test } from "node:test";
import assert from "node:assert/strict";
import { enhanceHelpImages, HELP_SIZES } from "../sites/silo/src/lib/help-images.mjs";

const img =
  '<img alt="The Library list" loading="lazy" decoding="async" sizes="(min-width: 3200px) 3200px, 100vw" data-astro-image="constrained" width="3200" height="2000" src="/_astro/library.big.webp" srcset="/_astro/library.a.webp 640w, /_astro/library.big.webp 3200w">';

test("wraps a Markdown screenshot in a full-size link and sets the column sizes", () => {
  const { html, count } = enhanceHelpImages(`<p>${img}</p><img src="/_astro/logo.svg" alt="">`);
  assert.equal(count, 1);
  assert.match(html, /^<p><a class="zoom" href="\/_astro\/library\.big\.webp" data-zoom><img /);
  assert.ok(html.includes(`sizes="${HELP_SIZES}"`));
  assert.ok(!html.includes("100vw\""), "the 100vw default is gone");
  assert.ok(html.includes('<span class="zoom-hint" aria-hidden="true">Full size</span></a></p>'));
  assert.ok(html.endsWith('<img src="/_astro/logo.svg" alt="">'), "other images are left alone");
});

test("refuses a screenshot it can't size", () => {
  assert.throws(() => enhanceHelpImages('<img data-astro-image="constrained" src="/x.webp">'), /without src or sizes/);
});
