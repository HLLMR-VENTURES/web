---
title: "The library: active vs. parked"
label: "The library: active vs. parked"
summary: "Farming Simulator loads mods from one flat folder: Documents/My Games/FarmingSimulator2025/mods/."
group: "Your library"
order: 2
legacyAnchor: "library-h"
appliesTo: "0.11"
---
Farming Simulator loads mods from one flat folder: `Documents/My Games/FarmingSimulator2025/mods/`. Every `.zip` in there is read at startup, with no subfolders and no notion of "installed but off." Silo's core idea is to separate that dumping ground into two things: your whole **curated source library** — everything you own, browsable on the **Library** tab — and the flat `mods/` folder the game actually reads, which Silo fills with only the set you want loaded.

## Active vs. parked

Every mod in your library is either **active** (loaded by the game) or **parked** (kept in the library, filed away, not loaded). The library shows either as widescreen **tiles** (the default — an active mod gets a bright-green border and a green on/off switch) or as a compact **list** with a dot on the left; toggle the view from the button by the count. Either way, click the switch/dot to activate or park. Parked mods carry a small `parked` badge and dim slightly, and the detail drawer shows `● Active` or `○ Parked`.

The checkbox in the toolbar activates or parks everything *in the current view* at once — most useful with a filter applied. Sweeping your **whole unfiltered library** asks for confirmation first, since that's a lot of files to move (and on a cloud-synced folder each one is copied or removed individually). Parking never deletes anything — it just leaves the mod out of the game's folder. Parking a **loose, unorganized** mod (one you dropped straight into `mods/`) files it into your library as it parks it, so it leaves the live folder but stays available; activating it again re-projects it.

## Organize

Reach for **Organize** when your `mods/` folder is a flat pile and you want it sorted. It moves each loose `.zip` into `mods/archive/<Category>/` — subfolders the game deliberately ignores, since it only reads the flat root. (If you've [moved your library archive](/help/library-archive/), they go into the category folders there instead.) Your active mods stay loaded; nothing is duplicated. You'll find the button in the top bar (*Organize N*, showing how many loose mods it found) and under **Settings → Library layout**.

Before it touches a file, Organize shows a read-only **dry run**: a preview grouped by destination category (for example "12 into Vehicles, 3 into Maps"), each file with its exact `archive/<Category>/…` target. Nothing has moved yet — you confirm with the *Organize N mods* button or **Cancel**. Power users can tick *Don't preview next time*, or turn on **Auto-file new mods** in Settings to file new downloads automatically. Only Organize shows a preview. Auto-file (once you turn it on), activating or parking a mod, and adopting an update act straight away.

## How active mods reach the game

Silo keeps the flat `mods/` folder holding exactly your active set by **projecting** the archived originals back into it: `.zip` mods as same-volume **hardlinks**, unpacked mod folders as directory links (a symlink, or on Windows without Developer Mode an NTFS **junction**). Hardlinks and junctions use no extra disk and need no admin rights or Developer Mode. (If your library archive is on another drive, Silo uses symlinks or copies instead. See [Active mods across drives](/help/library-archive/).) The link changes the moment you switch a mod on or off. **▶ Launch** just starts the game, which reads that folder and loads the mods you marked active, however you start it.

Where links aren't permitted — most commonly a **cloud-synced** `Documents` folder (OneDrive, Google Drive, Proton Drive), which blocks hardlinks — Silo falls back to **copies**. It works exactly the same, but each active mod's bytes are duplicated into the live folder, so activating a large set is slower and uses more disk. Silo records what it projected so it can still tell its own copy from a build you swapped in, and it warns you once when it detects a cloud folder. To get fast, no-duplication hardlink projection back, exclude the FS25 folder from your cloud sync.

> **It never destroys your originals.** Moves are instant same-volume renames, or a safe copy-then-swap across volumes, so the original is never lost mid-operation. **Restore vanilla layout** (Settings, shown once anything is organized) puts every mod back in your mods folder: it drops Silo's projections, moves the archived files back into a plain flat `mods/` , and removes only empty archive folders. Every mod you had parked loads again after that. It never deletes a file it doesn't recognize, never removes the only copy of a mod, and won't touch a file you swapped in yourself. A copied folder mod you edited is moved to `backups/` instead of being deleted. The `backups/` folder itself stays where it is.
