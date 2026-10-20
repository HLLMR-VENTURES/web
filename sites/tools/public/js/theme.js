/* Applies the saved light/dark choice before first paint. Loaded as a small blocking, same-origin
 * script in <head> so the page never flashes the wrong theme and CSP needs no inline hash.
 * The key is disclosed on /privacy/. */
(function () {
  try {
    var saved = localStorage.getItem("hllmr-theme");
    if (saved === "light" || saved === "dark") {
      document.documentElement.setAttribute("data-theme", saved);
    }
  } catch (e) {
    /* storage blocked: follow prefers-color-scheme */
  }
})();
