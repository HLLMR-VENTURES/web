/**
 * Renders HTML to PNG at an exact pixel size with headless Microsoft Edge (or Chrome) over the
 * DevTools protocol: the same browser the sites' og.png cards are rendered with, so the brand fonts
 * (self-hosted @fontsource files) draw exactly as on the web. No npm dependency: Node's own
 * WebSocket and fetch drive the browser.
 */
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const CANDIDATES = [
  process.env.MEDIA_KIT_BROWSER,
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/microsoft-edge",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

export async function openBrowser() {
  const exe = CANDIDATES.find((p) => existsSync(p));
  if (!exe) throw new Error("No Edge or Chrome found; set MEDIA_KIT_BROWSER to its executable.");
  const profile = mkdtempSync(join(tmpdir(), "media-kit-"));
  const proc = spawn(
    exe,
    ["--headless=new", "--remote-debugging-port=0", `--user-data-dir=${profile}`, "--no-first-run", "--hide-scrollbars", "--force-color-profile=srgb", "about:blank"],
    { stdio: "ignore" },
  );
  let port;
  for (let i = 0; i < 100 && !port; i++) {
    await sleep(100);
    const f = join(profile, "DevToolsActivePort");
    if (existsSync(f)) port = readFileSync(f, "utf8").split("\n")[0].trim();
  }
  if (!port) throw new Error("The browser did not open a DevTools port.");
  const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const page = targets.find((t) => t.type === "page");
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((res, rej) => ((ws.onopen = res), (ws.onerror = rej)));
  let id = 0;
  const pending = new Map();
  const waiters = [];
  ws.onmessage = (m) => {
    const msg = JSON.parse(m.data);
    if (msg.id && pending.has(msg.id)) {
      const { res, rej } = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? rej(new Error(msg.error.message)) : res(msg.result);
    } else if (msg.method) {
      for (const w of waiters.splice(0)) w(msg);
    }
  };
  const send = (method, params = {}) =>
    new Promise((res, rej) => {
      pending.set(++id, { res, rej });
      ws.send(JSON.stringify({ id, method, params }));
    });
  await send("Page.enable");
  await send("Runtime.enable");

  const load = async (html, width, height) => {
    await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: false });
    const { frameTree } = await send("Page.getFrameTree");
    await send("Page.setDocumentContent", { frameId: frameTree.frame.id, html });
    await send("Runtime.evaluate", { expression: "document.fonts.ready.then(() => document.fonts.size)", awaitPromise: true });
  };

  return {
    /** Loads `html` and returns the value of `expression` evaluated in it (JSON-serialisable). */
    async measure(html, expression) {
      await load(html, 1000, 300);
      const { result } = await send("Runtime.evaluate", { expression, returnByValue: true });
      return result.value;
    },
    /** Renders `html` at width x height CSS px (1:1 device pixels); returns PNG bytes. */
    async shot(html, width, height, { transparent = false } = {}) {
      await send("Emulation.setDefaultBackgroundColorOverride", transparent ? { color: { r: 0, g: 0, b: 0, a: 0 } } : {});
      await load(html, width, height);
      await sleep(30);
      const { data } = await send("Page.captureScreenshot", {
        format: "png",
        clip: { x: 0, y: 0, width, height, scale: 1 },
        captureBeyondViewport: false,
      });
      return Buffer.from(data, "base64");
    },
    async close() {
      try {
        await send("Browser.close");
      } catch {}
      ws.close();
      await sleep(300);
      proc.kill();
      try {
        rmSync(profile, { recursive: true, force: true });
      } catch {}
    },
  };
}
