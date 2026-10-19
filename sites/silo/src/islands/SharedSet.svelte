<script lang="ts">
  /**
   * Shared mod set handoff (/c/). Every shipped Silo build links here as /c/?g=<gist id> or
   * /c/?r=<owner>/<repo> (HLLMR/silo collection.rs PAGE_BASE), so the query contract is permanent.
   * The browser reads the set's silo-collection.json from GitHub (user content known only at view
   * time, disclosed in the privacy policy), shows the list, and hands off to the app through
   * silo://collection?url=<ref>, which the app's parseCollectionDeepLink accepts. Nothing is
   * installed or changed from this page.
   */
  interface SetMod {
    techName: string;
    version?: string;
    source?: string;
  }
  interface SharedSetDoc {
    schema: string;
    name: string;
    description?: string;
    author?: string;
    createdAt?: string;
    savegame?: { name: string; mapTitle?: string };
    mods: SetMod[];
  }
  type Ref = { kind: "gist"; id: string } | { kind: "repo"; owner: string; repo: string };
  type State =
    | { kind: "loading" }
    | { kind: "invalid" }
    | { kind: "missing" }
    | { kind: "limited" }
    | { kind: "not-a-set" }
    | { kind: "error" }
    | { kind: "ok"; set: SharedSetDoc };

  let { githubApi }: { githubApi: string } = $props();

  const FILE = "silo-collection.json";
  const SCHEMA_PREFIX = "silo.collection/";
  const MAX_BYTES = 1_000_000;
  // The same rules as the app (HLLMR/silo github.rs valid_gist_id, valid_owner, valid_repo).
  const GIST = /^[0-9a-fA-F]{20,40}$/;
  const OWNER = /^[A-Za-z0-9-]{1,39}$/;
  const REPO = /^[A-Za-z0-9._-]{1,100}$/;

  function readRef(): Ref | null {
    const q = new URLSearchParams(location.search);
    const g = (q.get("g") ?? "").trim();
    if (g) return GIST.test(g) ? { kind: "gist", id: g } : null;
    const r = (q.get("r") ?? "").trim();
    const [owner, repo, ...rest] = r.split("/");
    if (r && rest.length === 0 && OWNER.test(owner) && REPO.test(repo ?? "") && repo !== "." && repo !== "..") {
      return { kind: "repo", owner, repo };
    }
    return null;
  }

  const ref = readRef();
  const deepRef = ref ? (ref.kind === "gist" ? ref.id : `${ref.owner}/${ref.repo}`) : "";
  const deepLink = ref ? `silo://collection?url=${encodeURIComponent(deepRef)}` : "";
  const sourceUrl = ref
    ? ref.kind === "gist"
      ? `https://gist.github.com/${ref.id}`
      : `https://github.com/${ref.owner}/${ref.repo}`
    : "";

  let state = $state<State>(ref ? { kind: "loading" } : { kind: "invalid" });
  let opened = $state(false);

  class Http extends Error {
    status: number;
    limited: boolean;
    constructor(status: number, limited: boolean) {
      super(`GitHub ${status}`);
      this.status = status;
      this.limited = limited;
    }
  }

  async function get(url: string, accept: string, signal: AbortSignal): Promise<Response> {
    const r = await fetch(url, { headers: { Accept: accept }, credentials: "omit", signal });
    if (!r.ok) throw new Http(r.status, (r.status === 403 || r.status === 429) && r.headers.get("x-ratelimit-remaining") === "0");
    return r;
  }

  async function load(target: Ref, signal: AbortSignal): Promise<string> {
    if (target.kind === "repo") {
      const url = `${githubApi}/repos/${target.owner}/${target.repo}/contents/${FILE}`;
      return (await get(url, "application/vnd.github.raw+json", signal)).text();
    }
    const gist = await (await get(`${githubApi}/gists/${target.id}`, "application/vnd.github+json", signal)).json();
    const f = gist?.files?.[FILE];
    if (!f) throw new Http(404, false);
    if (!f.truncated) return String(f.content ?? "");
    // Large files: GitHub returns a raw URL on its own content host instead of the content.
    const raw = new URL(String(f.raw_url));
    if (raw.protocol !== "https:" || raw.hostname !== "gist.githubusercontent.com") throw new Error("unexpected raw host");
    return (await get(raw.toString(), "text/plain", signal)).text();
  }

  class NotASet extends Error {}

  function parse(text: string): SharedSetDoc {
    if (text.length > MAX_BYTES) throw new NotASet("too large");
    let doc;
    try {
      doc = JSON.parse(text);
    } catch {
      throw new NotASet("not JSON");
    }
    if (!doc || typeof doc.schema !== "string" || !doc.schema.startsWith(SCHEMA_PREFIX)) throw new NotASet("wrong schema");
    if (!Array.isArray(doc.mods)) throw new NotASet("no mods");
    doc.mods = doc.mods.filter((m: SetMod) => m && typeof m.techName === "string" && m.techName.trim());
    return doc as SharedSetDoc;
  }

  $effect(() => {
    if (!ref) return;
    const ctrl = new AbortController();
    load(ref, ctrl.signal)
      .then((text) => {
        const set = parse(text);
        state = { kind: "ok", set };
        document.title = `${set.name || "Shared mod set"} · Silo`;
      })
      .catch((e: unknown) => {
        if ((e as Error).name === "AbortError") return;
        if (e instanceof Http && e.limited) state = { kind: "limited" };
        else if (e instanceof Http && e.status === 404) state = { kind: "missing" };
        else if (e instanceof NotASet) state = { kind: "not-a-set" };
        else state = { kind: "error" };
      });
    return () => ctrl.abort();
  });

  const SOURCES: Record<string, string> = { github: "GitHub", modhub: "ModHub" };
  const sourceLabel = (s?: string) => (s ? (SOURCES[s.toLowerCase()] ?? s) : "");
  const plural = (n: number) => `${n} mod${n === 1 ? "" : "s"}`;
  function created(s?: string): string {
    if (!s) return "";
    const d = new Date(s);
    return isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  }
</script>

<section class="set" aria-live="polite">
  {#if state.kind === "loading"}
    <p class="status">Reading the shared mod set…</p>
  {:else if state.kind === "ok"}
    {@const set = state.set}
    <p class="kicker">Shared mod set</p>
    <h1>{set.name || "Untitled mod set"}</h1>
    <p class="meta">
      {#if set.author}<span>by {set.author}</span>{/if}
      <span>{plural(set.mods.length)}</span>
      {#if created(set.createdAt)}<span>{created(set.createdAt)}</span>{/if}
    </p>
    {#if set.savegame}
      <p class="save">
        For the savegame <strong>{set.savegame.name}</strong>{#if set.savegame.mapTitle}&nbsp;on {set.savegame.mapTitle}{/if}.
      </p>
    {/if}
    {#if set.description}<p class="desc">{set.description}</p>{/if}

    <div class="actions">
      <a class="btn btn-primary btn-lg" href={deepLink} onclick={() => (opened = true)}>Open in Silo</a>
      <a class="btn btn-ghost btn-lg" href="/#download">Get Silo first</a>
    </div>
    {#if opened}
      <p class="hint">Opening Silo… Nothing happened? <a href="/#download">Install Silo</a>, then choose Open in Silo again.</p>
    {/if}

    <h2>{plural(set.mods.length)}</h2>
    {#if set.mods.length}
      <ul class="mods">
        {#each set.mods as m}
          <li>
            <span class="name">{m.techName}</span>
            {#if m.version}<span class="ver">v{String(m.version).replace(/^v/i, "")}</span>{/if}
            {#if m.source}<span class="src">{sourceLabel(m.source)}</span>{/if}
          </li>
        {/each}
      </ul>
    {:else}
      <p class="status">This set lists no mods.</p>
    {/if}

    <div class="note">
      <h2>What happens when you open it</h2>
      <p>
        Silo shows a preview first: what you already have, what it can install from GitHub, and what you'd need to get
        from ModHub yourself. Nothing in your mods folder changes until you choose. Importing saves the list as a mod set.
      </p>
      <p>No mod files pass through this page; it only shows the list. <a href={sourceUrl} rel="noopener">View it on GitHub</a>.</p>
    </div>
  {:else}
    <p class="kicker">Shared mod set</p>
    <h1>
      {#if state.kind === "invalid"}That link doesn't look right{:else if state.kind === "missing"}This mod set isn't there any more{:else if state.kind === "limited"}GitHub is busy{:else if state.kind === "not-a-set"}That isn't a Silo mod set{:else}Couldn't load this mod set{/if}
    </h1>
    <p class="desc">
      {#if state.kind === "invalid"}
        Shared links look like <code>silo.hllmr.com/c/?g=…</code>. Ask the person who shared it for a fresh link.
      {:else if state.kind === "missing"}
        It may have been deleted or made private. Ask the person who shared it for a fresh link.
      {:else if state.kind === "limited"}
        GitHub is limiting requests from your network right now. Try again in a few minutes, or open the link in Silo.
      {:else if state.kind === "not-a-set"}
        The link points to a file Silo can't read as a mod set. Ask the person who shared it for a fresh link.
      {:else}
        Check your connection and try again. You can also open the link in Silo.
      {/if}
    </p>
    <div class="actions">
      {#if ref && state.kind !== "missing" && state.kind !== "not-a-set"}<a class="btn btn-primary btn-lg" href={deepLink} onclick={() => (opened = true)}>Open in Silo</a>{/if}
      <a class="btn btn-ghost btn-lg" href="/#download">Get Silo</a>
      <a class="btn btn-ghost btn-lg" href="/browse/">Browse the catalog</a>
    </div>
  {/if}
</section>

<style>
  .set {
    max-width: 820px;
    padding: 48px 0 72px;
  }
  .kicker {
    margin: 0 0 10px;
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--earth-text);
  }
  h1 {
    font-size: var(--text-3xl);
    line-height: var(--leading-tight);
    overflow-wrap: anywhere;
  }
  h2 {
    font-size: 1.4rem;
    margin: 40px 0 12px;
  }
  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 16px;
    color: var(--muted);
    margin: 12px 0 0;
  }
  .save,
  .desc {
    margin: 14px 0 0;
    max-width: 60ch;
  }
  .desc {
    color: var(--muted);
    white-space: pre-line;
    overflow-wrap: anywhere;
  }
  .status {
    color: var(--muted);
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 28px;
  }
  .btn-lg {
    font-size: 1.05rem;
    padding: 13px 22px;
    min-height: 48px;
  }
  .hint {
    margin: 14px 0 0;
    color: var(--muted);
  }
  .hint a,
  .note a {
    color: var(--primary-text);
  }
  .mods {
    list-style: none;
    margin: 0;
    padding: 0;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: var(--surface);
    max-height: 520px;
    overflow: auto;
  }
  .mods li {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 12px;
    align-items: baseline;
    padding: 9px 16px;
    border-top: 1px solid var(--border);
  }
  .mods li:first-child {
    border-top: none;
  }
  .name {
    font-family: var(--font-mono);
    font-size: 0.92rem;
    overflow-wrap: anywhere;
    flex: 1 1 260px;
  }
  .ver,
  .src {
    color: var(--muted);
    font-size: 0.88rem;
  }
  .src {
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 0 10px;
  }
  .note {
    margin-top: 32px;
    padding: 4px 20px 8px;
    border-radius: var(--radius);
    background: var(--sunken);
  }
  .note h2 {
    font-size: 1.1rem;
    margin: 16px 0 6px;
  }
  .note p {
    margin: 0 0 12px;
    color: var(--muted);
  }
</style>
