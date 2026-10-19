---
title: "Library health"
label: "Library health"
summary: "The Health panel reports problems with your whole library — issues that exist no matter which mods you have switched on."
group: "Your library"
order: 8
legacyAnchor: "health-h"
appliesTo: "0.11"
---
The **Health** panel reports problems with your *whole library* — issues that exist no matter which mods you have switched on. This is different from **Conflicts**, which only looks at the mods in your current active set and how they collide with each other. Reach for Health when you want to know whether the library itself is sound: are any mods broken, missing something they need, or quietly unloadable by the game?

## Opening it

In the status bar along the bottom, find the **need attention** button. The number on it is the total count of health issues; the button is highlighted whenever that count is above zero. Click it to open the **Library health** panel. If nothing is wrong you will see *"Everything looks healthy — no problems found."* Click the backdrop to close the panel.

Opening and reading the panel changes nothing. The only buttons that touch files are the **Keep** choices in the *Foreign files* section, which move one build to `backups/` when you click them. Everything else it finds you fix yourself.

## What it reports

Issues are grouped into up to four sections, each with a count:

- **Missing dependencies** — a mod's `modDesc.xml` declares another mod it depends on, and that mod is not present anywhere in your library. Each row names the mod and the dependency it *needs*, marked *not in your library*. To fix, add the required mod (for example via the **Browse** tab's in-app install, or by dropping it into your library) and rescan. Note this checks whether the dependency *exists* in the library, not whether it is currently active.
- **Ignored by the game — name starts with a digit** — Farming Simulator silently refuses to load any mod whose folder or file name begins with a number, so the mod appears installed but never runs. Each row shows the offending name. To fix, rename the mod so it starts with a letter.
- **Corrupt / unreadable** — Silo could not read or parse the mod (for example a damaged archive or malformed `modDesc.xml`). The row shows the underlying error. These usually mean an interrupted or corrupted download; re-download or reinstall the mod, then rescan.
- **Foreign files in your mods folder** — a file sitting at a managed mod's name that isn't the one Silo projected. Almost always this is a manual update you dropped in yourself (the normal way to update a ModHub mod). The row shows both versions — *Mods folder: v… · Silo's copy: v…* — and offers two safe choices: **Keep the mods-folder file** (adopt your build as the managed version) or **Keep Silo's copy** (put its version back). Either way the other build is moved to `backups/`, so nothing is lost. You can also adopt straight from the mod's detail drawer — see [Applying an update](/help/updates/).

## When to check it

Check Health after a batch of installs or updates, before building a loadout for a play session, or whenever a mod you expected to work simply is not appearing in-game. Because the list is derived live from the last scan, it refreshes on its own as your library changes — resolve an issue and rescan, and the corresponding row disappears.

> Health flags library-wide soundness. For clashes *between* the mods you have enabled, use the Conflicts panel instead.
