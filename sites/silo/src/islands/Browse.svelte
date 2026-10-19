<script lang="ts">
  /**
   * The public catalog (/browse/), a client island on the public SiloAPI: GET /stats, /categories,
   * /facets, /mods (search, filters, paging) and /mods/:id (the detail dialog). Search, category,
   * sort and facets are mirrored into the query string (?q=&category=&sort=&tag=&availableBy=), and
   * an open mod is ?mod=<id>, so any view and any record can be linked (the takedown policy asks
   * for a record link). There is no ?api= override: the API origin is fixed at build time.
   */
  interface Source {
    source: string;
    sourceUrl?: string | null;
    version?: string | null;
    installable?: boolean | null;
  }
  interface Mod {
    id: string;
    techName?: string;
    title?: string;
    author?: string | null;
    category?: string | null;
    description?: string | null;
    descriptionFull?: string | null;
    imageUrl?: string | null;
    latestVersion?: string | null;
    rating?: number | null;
    ratingCount?: number | null;
    downloads?: number | null;
    verified?: boolean;
    sources?: Source[];
    tags?: { namespace: string; value: string }[];
  }
  type Facets = Record<string, { value: string; count: number }[]>;

  let { api }: { api: string } = $props();

  const LIMIT = 30;
  const SORTS = [
    ["popular", "Most popular"],
    ["newest", "Newest"],
    ["rating", "Highest rated"],
    ["downloads", "Most downloaded"],
    ["name", "Name (A to Z)"],
  ] as const;
  const SOURCE_LABEL: Record<string, string> = { modhub: "ModHub", github: "GitHub", silo: "Silo" };
  const FACET_ORDER = ["theme", "brand", "region", "realism", "era"];
  const FACET_LABEL: Record<string, string> = { theme: "Theme", brand: "Brand", region: "Region", realism: "Realism", era: "Era" };
  const ID = /^[0-9a-fA-F-]{8,64}$/;

  const init = new URLSearchParams(location.search);
  let q = $state(init.get("q") ?? "");
  let category = $state(init.get("category") ?? "");
  let sort = $state(SORTS.some(([v]) => v === init.get("sort")) ? init.get("sort")! : "popular");
  let tags = $state<string[]>(init.getAll("tag").filter((t) => /^[a-z]+:[a-z0-9-]+$/.test(t)));
  let availableBy = $state<number | null>(Number(init.get("availableBy")) || null);

  let stats = $state<{ mods: number; sources: number } | null>(null);
  let categories = $state<{ category: string; count: number }[]>([]);
  let facets = $state<Facets>({});
  let mods = $state<Mod[]>([]);
  let total = $state(0);
  let status = $state<"loading" | "ready" | "error">("loading");
  let loadingMore = $state(false);

  let dialog = $state<HTMLDialogElement>();
  let detail = $state<{ kind: "loading" } | { kind: "error" } | { kind: "ok"; mod: Mod } | null>(null);

  const num = (n: unknown) => (typeof n === "string" ? Number(n) : (n as number));
  const fmt = (n: unknown) => num(n).toLocaleString("en-US");
  const label = (s: string) => SOURCE_LABEL[s] ?? s;
  const pretty = (v: string) => v.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const version = (v?: string | null) => (v ? `v${String(v).replace(/^v/i, "")}` : "");
  const uniqueSources = (m: Mod) => [...new Set((m.sources ?? []).map((s) => s.source))];

  async function json<T>(path: string, signal?: AbortSignal): Promise<T> {
    const r = await fetch(`${api}${path}`, { credentials: "omit", signal });
    if (!r.ok) throw new Error(String(r.status));
    return r.json() as Promise<T>;
  }

  function query(offset: number): string {
    const p = new URLSearchParams({ limit: String(LIMIT), offset: String(offset), sort });
    if (q.trim()) p.set("q", q.trim());
    if (category) p.set("category", category);
    for (const t of tags) p.append("tag", t);
    if (availableBy) p.set("availableBy", String(availableBy));
    return p.toString();
  }

  /** Mirror the view into the address bar (replaceState: filtering never fills the back stack). */
  function syncUrl(modId?: string | null) {
    const p = new URLSearchParams();
    if (q.trim()) p.set("q", q.trim());
    if (category) p.set("category", category);
    if (sort !== "popular") p.set("sort", sort);
    for (const t of tags) p.append("tag", t);
    if (availableBy) p.set("availableBy", String(availableBy));
    if (modId) p.set("mod", modId);
    const s = p.toString();
    history.replaceState(null, "", s ? `?${s}` : location.pathname);
  }

  let listCtrl: AbortController | undefined;
  async function load() {
    listCtrl?.abort();
    const ctrl = (listCtrl = new AbortController());
    status = "loading";
    try {
      const d = await json<{ mods: Mod[]; total: number }>(`/mods?${query(0)}`, ctrl.signal);
      mods = d.mods ?? [];
      total = num(d.total) || 0;
      status = "ready";
    } catch (e) {
      if ((e as Error).name !== "AbortError") status = "error";
    }
  }

  async function more() {
    loadingMore = true;
    try {
      const d = await json<{ mods: Mod[]; total: number }>(`/mods?${query(mods.length)}`);
      mods = [...mods, ...(d.mods ?? [])];
      total = num(d.total) || total;
    } catch {
      /* keep what is shown; the button stays for another try */
    } finally {
      loadingMore = false;
    }
  }

  let timer: ReturnType<typeof setTimeout> | undefined;
  function changed(debounce = false) {
    clearTimeout(timer);
    const run = () => {
      syncUrl(detail ? currentModId : null);
      load();
    };
    if (debounce) timer = setTimeout(run, 260);
    else run();
  }

  function setFacet(ns: string, value: string) {
    tags = [...tags.filter((t) => !t.startsWith(`${ns}:`)), ...(value ? [`${ns}:${value}`] : [])];
    changed();
  }
  const facetValue = (ns: string) => tags.find((t) => t.startsWith(`${ns}:`))?.slice(ns.length + 1) ?? "";
  function clearFilters() {
    tags = [];
    availableBy = null;
    category = "";
    changed();
  }

  let currentModId: string | null = null;
  async function open(id: string) {
    if (!ID.test(id)) return;
    currentModId = id;
    syncUrl(id);
    detail = { kind: "loading" };
    if (dialog && !dialog.open) dialog.showModal();
    try {
      const mod = await json<Mod>(`/mods/${encodeURIComponent(id)}`);
      if (currentModId === id) detail = { kind: "ok", mod };
    } catch {
      if (currentModId === id) detail = { kind: "error" };
    }
  }
  function closed() {
    currentModId = null;
    detail = null;
    syncUrl(null);
  }

  $effect(() => {
    json<{ mods: number; sources: number }>("/stats").then((s) => (stats = s)).catch(() => {});
    json<{ categories: { category: string; count: number }[] }>("/categories")
      .then((c) => (categories = [...(c.categories ?? [])].sort((a, b) => a.category.localeCompare(b.category, undefined, { sensitivity: "base" }))))
      .catch(() => {});
    json<{ facets: Facets }>("/facets").then((f) => (facets = f.facets ?? {})).catch(() => {});
    load();
    const m = init.get("mod");
    if (m) open(m);
  });

  const facetNames = $derived(
    Object.keys(facets)
      .filter((ns) => facets[ns]?.length)
      .sort((a, b) => (FACET_ORDER.indexOf(a) + 100) % 100 - ((FACET_ORDER.indexOf(b) + 100) % 100)),
  );
  const filtered = $derived(tags.length > 0 || !!availableBy || !!category);
</script>

<div class="browse">
  <p class="kicker">Public catalog · no account · no ads</p>
  <h1>Browse the FS25 mod catalog</h1>
  <p class="lede">
    {#if stats}{fmt(stats.mods)} mods from {fmt(stats.sources)} ModHub and GitHub listings, merged into one record per mod.{:else}Mods from
      ModHub and GitHub, merged into one record per mod.{/if}
    Every mod links back to its original source. Silo indexes mods; it doesn't host them.
  </p>

  <div class="controls" role="search">
    <label class="search">
      <span class="visually-hidden">Search mods</span>
      <input type="search" placeholder="Search mods" autocomplete="off" bind:value={q} oninput={() => changed(true)} />
    </label>
    <label>
      <span class="visually-hidden">Category</span>
      <select bind:value={category} onchange={() => changed()}>
        <option value="">All categories</option>
        {#each categories as c}<option value={c.category}>{c.category} ({fmt(c.count)})</option>{/each}
      </select>
    </label>
    <label>
      <span class="visually-hidden">Sort</span>
      <select bind:value={sort} onchange={() => changed()}>
        {#each SORTS as [v, l]}<option value={v}>{l}</option>{/each}
      </select>
    </label>
  </div>
  {#if facetNames.length}
    <details class="more-filters" open={tags.length > 0 || !!availableBy}>
      <summary>More filters{tags.length + (availableBy ? 1 : 0) ? ` (${tags.length + (availableBy ? 1 : 0)} on)` : ""}</summary>
    <div class="facets">
      {#each facetNames as ns}
        <label>
          <span class="visually-hidden">Filter by {FACET_LABEL[ns] ?? ns}</span>
          <select value={facetValue(ns)} onchange={(e) => setFacet(ns, (e.currentTarget as HTMLSelectElement).value)}>
            <option value="">{FACET_LABEL[ns] ?? ns}: all</option>
            {#each facets[ns] as f}<option value={f.value}>{pretty(f.value)} ({fmt(f.count)})</option>{/each}
          </select>
        </label>
      {/each}
      <label>
        <span class="visually-hidden">Available by year</span>
        <input
          class="year"
          type="number"
          min="1900"
          max="2100"
          placeholder="Available by year"
          value={availableBy ?? ""}
          onchange={(e) => {
            const v = parseInt((e.currentTarget as HTMLInputElement).value, 10);
            availableBy = v >= 1900 && v <= 2100 ? v : null;
            changed();
          }}
        />
      </label>
      {#if filtered}<button type="button" class="btn btn-ghost" onclick={clearFilters}>Clear filters</button>{/if}
    </div>
    </details>
  {/if}

  <p class="count" aria-live="polite">
    {#if status === "loading"}Loading the catalog…{:else if status === "error"}{:else}{fmt(total)} mods{/if}
  </p>

  {#if status === "error"}
    <p class="state">Couldn't reach the catalog. <button type="button" class="link" onclick={() => load()}>Try again</button></p>
  {:else if status === "ready" && mods.length === 0}
    <p class="state">No mods match that search.</p>
  {:else}
    <ul class="grid" aria-busy={status === "loading"}>
      {#each mods as m (m.id)}
        <li>
          <button type="button" class="card" onclick={() => open(m.id)}>
            <span class="thumb">
              {#if m.imageUrl}<img src={m.imageUrl} alt="" loading="lazy" width="320" height="180" />{/if}
            </span>
            <span class="body">
              <span class="title">{m.title || m.techName}</span>
              <span class="author">{m.author || "Unknown author"}</span>
              <span class="meta">
                {#if m.verified}<span class="badge ok">Verified build</span>{/if}
                {#each uniqueSources(m) as s}<span class="badge">{label(s)}</span>{/each}
                {#if m.latestVersion}<span>{version(m.latestVersion)}</span>{/if}
                {#if m.rating != null && m.ratingCount}<span>Rated {num(m.rating).toFixed(1)}</span>{/if}
              </span>
            </span>
          </button>
        </li>
      {/each}
    </ul>
    {#if status === "ready" && mods.length < total}
      <p class="more"><button type="button" class="btn btn-ghost" onclick={more} disabled={loadingMore}>{loadingMore ? "Loading…" : "Load more"}</button></p>
    {/if}
  {/if}
</div>

<dialog bind:this={dialog} class="sheet" aria-labelledby="sheet-title" onclose={closed}>
  <form method="dialog" class="close"><button type="submit" aria-label="Close">Close</button></form>
  {#if detail?.kind === "ok"}
    {@const m = detail.mod}
    {#if m.imageUrl}<img class="cover" src={m.imageUrl} alt="" width="640" height="360" />{/if}
    <h2 id="sheet-title">{m.title || m.techName}</h2>
    {#if m.author}<p class="by">by {m.author}</p>{/if}
    <p class="pills">
      {#if m.verified}<span class="badge ok">Verified build</span>{/if}
      {#if m.category}<span class="badge">{m.category}</span>{/if}
      {#if m.latestVersion}<span class="badge">{version(m.latestVersion)}</span>{/if}
      {#if m.rating != null && m.ratingCount}<span class="badge">Rated {num(m.rating).toFixed(1)} ({fmt(m.ratingCount)} votes)</span>{/if}
      {#if m.downloads != null}<span class="badge">{fmt(m.downloads)} downloads</span>{/if}
    </p>
    {#if m.descriptionFull || m.description}<p class="desc">{m.descriptionFull || m.description}</p>{/if}
    {#if m.tags?.length}
      <p class="tags">{#each m.tags as t}<span>{pretty(t.value)}</span>{/each}</p>
    {/if}
    <h3>Where to get it</h3>
    <ul class="sources">
      {#each m.sources ?? [] as s}
        <li>
          <strong>{label(s.source)}</strong>
          <span>{[version(s.version), s.installable ? "Silo can install it directly" : "opens the source page"].filter(Boolean).join(" · ")}</span>
          {#if s.sourceUrl}<a href={s.sourceUrl} rel="noopener nofollow">Open on {label(s.source)}</a>{/if}
        </li>
      {:else}
        <li><span>No linked sources.</span></li>
      {/each}
    </ul>
    <p class="fine">
      Information indexed from public sources and linked above. Silo does not host these files: download from the original
      source. Verified build means Silo has the published build's hashes on file to compare against. It's a provenance check,
      not a virus scan.
    </p>
  {:else if detail?.kind === "error"}
    <h2 id="sheet-title">Couldn't load this mod</h2>
    <p>It may have been removed from the catalog, or the catalog is unreachable. Try again in a moment.</p>
  {:else}
    <h2 id="sheet-title">Loading…</h2>
  {/if}
</dialog>

<style>
  .browse {
    padding: 40px 0 72px;
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
  }
  .lede {
    color: var(--muted);
    max-width: 62ch;
    margin: 14px 0 24px;
  }
  .controls,
  .facets {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 8px;
  }
  .search {
    flex: 1 1 280px;
  }
  .controls label,
  .facets label {
    min-width: 0;
    max-width: 100%;
  }
  select {
    text-overflow: ellipsis;
  }
  .more-filters summary {
    cursor: pointer;
    font-weight: 600;
    padding: 8px 0;
    min-height: 44px;
    display: flex;
    align-items: center;
  }
  input,
  select {
    font: inherit;
    font-size: 0.95rem;
    min-height: 44px;
    padding: 8px 12px;
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-sm);
    background: var(--raised);
    color: var(--text);
    max-width: 100%;
  }
  .search input {
    width: 100%;
  }
  .year {
    width: 11rem;
  }
  .count {
    color: var(--muted);
    margin: 14px 0;
  }
  .state {
    padding: 32px 0;
    color: var(--muted);
  }
  .link {
    font: inherit;
    border: none;
    background: none;
    color: var(--primary-text);
    text-decoration: underline;
    cursor: pointer;
    padding: 0;
  }
  .grid {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
    gap: 16px;
  }
  .card {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding: 0;
    text-align: left;
    font: inherit;
    color: var(--text);
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
    cursor: pointer;
  }
  .card:hover {
    border-color: color-mix(in srgb, var(--primary) 45%, var(--border));
    box-shadow: var(--shadow-1);
  }
  .thumb {
    display: block;
    aspect-ratio: 16 / 9;
    background: var(--sunken);
  }
  .thumb img,
  .cover {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .body {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 12px 14px 14px;
  }
  .title {
    font-weight: 700;
    overflow-wrap: anywhere;
  }
  .author {
    color: var(--muted);
    font-size: 0.9rem;
  }
  .meta,
  .pills {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 8px;
    align-items: center;
    font-size: 0.85rem;
    color: var(--muted);
    margin-top: 4px;
  }
  .badge {
    border: 1px solid var(--border-strong);
    border-radius: 999px;
    padding: 1px 9px;
    font-size: 0.8rem;
    color: var(--text);
  }
  .badge.ok {
    border-color: var(--success);
    color: var(--success);
    font-weight: 700;
  }
  .more {
    text-align: center;
    margin-top: 24px;
  }
  .sheet {
    width: min(720px, calc(100vw - 32px));
    max-height: calc(100vh - 48px);
    padding: 24px 28px 28px;
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    background: var(--surface);
    color: var(--text);
    box-shadow: var(--shadow-2);
  }
  .sheet::backdrop {
    background: rgb(20 22 16 / 0.55);
  }
  .close {
    display: flex;
    justify-content: flex-end;
    margin: -8px -12px 8px 0;
  }
  .close button {
    font: inherit;
    font-weight: 600;
    min-height: 40px;
    padding: 6px 14px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background: var(--raised);
    color: var(--text);
    cursor: pointer;
  }
  .cover {
    aspect-ratio: 16 / 9;
    border-radius: var(--radius);
    margin-bottom: 16px;
  }
  .sheet h2 {
    font-size: 1.7rem;
    line-height: 1.15;
  }
  .by {
    color: var(--muted);
    margin: 4px 0 0;
  }
  .desc {
    white-space: pre-line;
    overflow-wrap: anywhere;
    margin: 16px 0;
  }
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .tags span {
    background: var(--sunken);
    border-radius: 999px;
    padding: 2px 10px;
    font-size: 0.85rem;
  }
  .sheet h3 {
    font-size: 1.15rem;
    margin: 20px 0 8px;
  }
  .sources {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 8px;
  }
  .sources li {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 12px;
    align-items: baseline;
    padding: 10px 12px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
  }
  .sources span {
    color: var(--muted);
    font-size: 0.9rem;
    flex: 1 1 200px;
  }
  .sources a {
    color: var(--primary-text);
    font-weight: 600;
  }
  .fine {
    margin-top: 18px;
    font-size: 0.85rem;
    color: var(--muted);
  }
</style>
