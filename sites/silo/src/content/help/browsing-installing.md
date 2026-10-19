---
title: "Browsing & installing mods"
label: "Browsing & installing mods"
summary: "The Browse tab is where you find new mods without leaving Silo."
group: "Finding & verifying mods"
order: 9
legacyAnchor: "browsing-installing-h"
appliesTo: "0.11"
---
The **Browse** tab is where you find new mods without leaving Silo. It reads the SiloAPI catalog, a single index that merges the same mod across **GitHub** and **ModHub**, so you see one card per mod instead of scattered listings. The header shows how many mods the catalog holds and how many ModHub and GitHub listings they come from.

## Finding a mod

- **Search** — type in the *Search the catalog…* box. Results refresh as you type (after a short pause).
- **Category** — the *All categories* dropdown filters by mod category, with a count next to each.
- **Sort** — order by Popular, Most downloaded, Top rated, Newest, or Name (A–Z).
- **More results** — the grid loads 60 at a time; use *Load more* at the bottom to page through.

Any mod you already have shows an **In library** badge, so you can tell at a glance what is new.

## Source buttons and versions

Each card carries one button per source the mod lives on — `GH`, `MH` — each labelled with *that source's own version*, because those versions drift apart. A download arrow (⬇) means Silo can install it for you; an up-right arrow (↗) means the button opens the source's page instead.

## Installing from GitHub, in-app

GitHub release mods are directly installable. Click the GitHub button (or **Install ⬇** in the detail drawer) and Silo downloads the `.zip` straight into your mods folder, showing a live progress bar with the megabytes transferred. When it finishes you'll see *Installed …* and the library rescans automatically. When the catalog has the published build on file, Silo checks the download against it and refuses a file that doesn't match. You don't need to connect a GitHub account to install.

> Installing only adds a new `.zip` to your mods folder. It never edits or removes anything you already have, and it won't replace a file that's already there. To undo an install, delete the `.zip` from your mods folder (or from its archive folder if Silo filed it), then rescan.

## ModHub is index-only

Silo can list ModHub mods but doesn't download them for you. ModHub mods download from GIANTS' website, so the button reads **Open page ↗** and takes you to the source. Grab the `.zip` there, drop it in your mods folder, and Silo files a new mod automatically on the next scan. If you're *updating* a mod you already manage — dropping the newer `.zip` over Silo's copy — Silo notices the newer build and offers to adopt it; see [Applying an update](/help/updates/).

## The detail drawer

Click **anywhere on a card** to open a side drawer with the cover image, author, version, category, tech name, rating and downloads, and the full *Available from* source list. For a GitHub source it also shows live repo stats (stars, forks, watchers, issues) and, once you connect GitHub and turn on **Enable actions**, Star and Watch buttons. Use *Read more →* to expand the full description.

The drawer is **non-modal**: the grid behind it stays live, so you can click another card to switch the drawer straight to that mod without closing it first. Close with the `✕` or the **Escape** key. If a mod is already in your library, its card and drawer offer **⌕ Find in Library**, which jumps to it on the Library tab (with its drawer open) — the mirror of the library's **Find in Browse** link, which goes the other way.

## Browsing without the app

You can also explore the same catalog in any web browser at [silo.hllmr.com/browse](/browse/). It reads the public SiloAPI directly; in-app installing still happens inside Silo.
