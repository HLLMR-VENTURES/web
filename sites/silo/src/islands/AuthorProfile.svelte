<script lang="ts">
  /**
   * Public verified-author profile (authors plan §1.8). Rendered into the /authors/profile.shell.html
   * shell, which nginx serves for every /authors/<login>/ path. Reads the login from the URL path
   * (or ?login= when the shell is opened directly, for local development), validates it, then
   * calls the public, uncredentialed GET /authors/:login.
   */
  interface VerifiedMod {
    id: string | number;
    title: string;
    techName: string;
    latestVersion: string | null;
  }
  interface AuthorProfile {
    login: string;
    avatarUrl: string | null;
    verifiedMods: VerifiedMod[];
  }

  let { api }: { api: string } = $props();

  /** GitHub logins: alphanumerics and single inner hyphens, at most 39 characters. */
  const LOGIN = /^[A-Za-z0-9](?:[A-Za-z0-9]|-(?=[A-Za-z0-9])){0,38}$/;

  type State =
    | { kind: "loading" }
    | { kind: "invalid" }
    | { kind: "not-found"; login: string }
    | { kind: "error"; login: string }
    | { kind: "ok"; profile: AuthorProfile };

  let state = $state<State>({ kind: "loading" });

  function loginFromLocation(): string | null {
    const m = location.pathname.match(/^\/authors\/([^/]+)\/?$/);
    const fromPath = m ? decodeURIComponent(m[1]) : null;
    if (fromPath && LOGIN.test(fromPath)) return fromPath;
    // The shell itself (/authors/profile.shell.html?login=jane) is the dev and fixture entry point.
    return new URLSearchParams(location.search).get("login");
  }

  $effect(() => {
    const login = loginFromLocation();
    if (!login || !LOGIN.test(login)) {
      state = { kind: "invalid" };
      return;
    }
    const ctrl = new AbortController();
    fetch(`${api}/authors/${encodeURIComponent(login)}`, { credentials: "omit", signal: ctrl.signal })
      .then(async (r) => {
        if (r.status === 404) return void (state = { kind: "not-found", login });
        if (!r.ok) throw new Error(String(r.status));
        state = { kind: "ok", profile: (await r.json()) as AuthorProfile };
        document.title = `${state.profile.login}, verified author | Silo`;
      })
      .catch((e: unknown) => {
        if ((e as Error).name !== "AbortError") state = { kind: "error", login };
      });
    return () => ctrl.abort();
  });
</script>

<div class="profile" aria-live="polite" aria-busy={state.kind === "loading"}>
  {#if state.kind === "loading"}
    <p class="muted">Loading author…</p>
  {:else if state.kind === "invalid"}
    <h1>Author not found</h1>
    <p class="muted">That isn't a valid GitHub login.</p>
  {:else if state.kind === "not-found"}
    <h1>Author not found</h1>
    <p class="muted"><code>{state.login}</code> hasn't claimed any mods on Silo yet.</p>
  {:else if state.kind === "error"}
    <h1>Couldn't load this author</h1>
    <p class="muted">The catalog didn't answer. Try again in a minute.</p>
  {:else}
    {@const p = state.profile}
    <header class="who">
      {#if p.avatarUrl}
        <img src={p.avatarUrl} alt="" width="72" height="72" />
      {/if}
      <div>
        <h1>{p.login}</h1>
        <p class="pill" title="The author claimed these listings via GitHub">✔ Verified author</p>
      </div>
    </header>
    <h2>Verified mods</h2>
    {#if p.verifiedMods.length === 0}
      <p class="muted">No verified mods yet.</p>
    {:else}
      <ul class="mods">
        {#each p.verifiedMods as m (m.id)}
          <li>
            <a href={`/browse/?mod=${encodeURIComponent(String(m.id))}`}>{m.title}</a>
            <span class="muted"><code>{m.techName}</code>{m.latestVersion ? ` · v${m.latestVersion}` : ""}</span>
          </li>
        {/each}
      </ul>
    {/if}
  {/if}
</div>

<style>
  .profile {
    padding: 64px 0;
  }
  h1 {
    font-size: var(--text-2xl);
  }
  h2 {
    font-size: var(--text-xl);
    margin-top: 32px;
  }
  .muted {
    color: var(--muted);
  }
  .who {
    display: flex;
    gap: 18px;
    align-items: center;
  }
  .who img {
    border-radius: 50%;
    border: 1px solid var(--border);
  }
  /* Deliberately distinct from the build-provenance "✓ Verified build" badge (plan §1.8). */
  .pill {
    display: inline-block;
    margin: 6px 0 0;
    padding: 2px 10px;
    border-radius: 999px;
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--on-primary);
    background: var(--info);
  }
  .mods {
    list-style: none;
    padding: 0;
    display: grid;
    gap: 10px;
  }
  .mods li {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 12px;
    align-items: baseline;
    padding: 12px 16px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
  }
  .mods a {
    font-weight: 600;
    color: var(--primary);
  }
</style>
