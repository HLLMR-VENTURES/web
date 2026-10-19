---
title: "Keeping mods updated"
label: "Keeping mods updated"
summary: "Silo checks your whole mod library against a canonical catalog and tells you which mods have a newer version available."
group: "Finding & verifying mods"
order: 10
legacyAnchor: "updates-h"
appliesTo: "0.11"
---
Silo checks your whole mod library against a canonical catalog and tells you which mods have a newer version available. It is designed to avoid a common false alarm: a mod you installed from ModHub showing as "outdated" only because a different version exists on GitHub (or the reverse). Silo compares against the **latest across ModHub and GitHub**, so you see a real update, not a source mismatch.

## Running the library-wide check

In the top bar, click **⟳ Updates**. (The button appears once you have mods in your library.) While it works, the button reads **Checking…** and a **Mod updates** panel opens with a running count of how many updates are available.

Two things happen behind the scenes:

1. One request sends the tech names of your installed mods to the SiloAPI catalog, which answers with the latest version per mod across GitHub and ModHub. Silo compares that with your versions on your machine.
2. Any mods you have personally linked to a GitHub repo are then checked directly, and that result takes precedence for those mods — your chosen source wins.

Each mod with a newer version shows its title, a source badge (for example `github`), and `current → latest`. A bottom line summarizes how many mods are **Up to date** and how many hit an **error**. If nothing in your library matches the catalog, you'll see a note that mods on GitHub can also be linked to their repo in the detail panel.

> The check is read-only. Nothing on disk changes until you explicitly install an update. If the catalog can't be reached, Silo quietly falls back to checking only your linked GitHub repos.

## Per-mod status in the detail drawer

Open any mod to see its own **GitHub updates** section. If the mod's `modDesc` points at a repository, Silo suggests `owner/repo` for you — click **Link** to confirm, or type your own. Then use **Check for update**. The result reads either *Update available: &lt;tag&gt; (you have &lt;version&gt;)* or *Up to date*, with an **Open repo** / **View release** link for context.

## Where it came from

For mods that aren't on ModHub or GitHub, Silo can't check for updates by itself, but it can remember where you got them. Open the mod and find **Where it came from**. Paste the page you downloaded the mod from and click **Save**. After that the section shows the site's name with **Open page ↗** (it opens in your browser), **Change**, and **Remove**. When you've looked at the page, click **I checked it** and Silo notes the date (*You last checked it on …*).

When you run **⟳ Updates**, mods with a saved page that the check couldn't answer are listed under **Check these yourself**, the ones you haven't looked at longest first. Each row has **Open page ↗** and **I checked it**. If the page you save is a GitHub repository and the mod isn't linked to one yet, Silo links it for GitHub update checks too.

> Silo only stores the address. It never visits the page itself; your browser does when you click Open page.

## Applying an update

Where a downloadable asset exists, click **Install** in the Updates panel (or **Download &amp; install** in the drawer). Silo downloads the new version next to the old one, checks that it's a complete mod archive, swaps it in, and keeps the previous version in `backups/` (the newest three per mod). Afterward it rescans so your library reflects the new version.

> Safety: if Silo stops mid-update, it finishes or rolls back the swap on the next scan and tells you what it did. Silo won't update a mod while Farming Simulator 25 is running, and it asks before you quit while it's still changing files. Updates download only from GitHub. Mods indexed as open-page only (typical for ModHub) have no direct-download asset. For those, update by drop-in, below.

## Updating a ModHub mod (drop-in)

ModHub doesn't allow direct download, so you update those the manual way: on the mod's page, download the new `.zip` and save it into your `mods/` folder, replacing the file that's there. Silo sees that the file no longer matches its managed copy and, rather than silently trusting or discarding it, surfaces it as something to reconcile.

Open that mod and the drawer leads with a banner: *"A newer build is in your mods folder — v1.0.3.0. Silo manages v1.0.2.0."* with two buttons:

- **⬆ Adopt v1.0.3.0** — promotes the build you dropped in to be Silo's managed version. The old version is tucked into `backups/`, and if the mod is active the new build is re-projected. The library now shows the new version; you're done.
- **Keep Silo's v1.0.2.0** — you changed your mind: Silo's managed copy is put back over the dropped file (your file goes to `backups/`).

The same choice is available in the [Library health](/help/health/) panel as *foreign files*, but the drawer banner is the quick path — download, drop in, open the mod, **Adopt**.

## The "Needs update" filter

The Library toolbar has a **↑ Needs update** toggle that narrows the list to just the mods with a newer version available. The first time you switch it on it runs a quiet check (no panel), then filters to the results — or tells you everything's current. It's the fastest way to see, and act on, only what's actually out of date.
