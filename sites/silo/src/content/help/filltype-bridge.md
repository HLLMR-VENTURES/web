---
title: "Filltype bridge (the sugar-beet fix)"
label: "Filltype bridge (the sugar-beet fix)"
summary: "Some maps add their own fill types (a custom crop or material) that none of your equipment will touch."
group: "Tools"
order: 18
legacyAnchor: "filltype-bridge-h"
appliesTo: "0.11"
---
Some maps add their own fill types (a custom crop or material) that none of your equipment will touch. FS25 decides what a trailer, shovel, silo, or sell point can handle *by category* — a trailer takes `BULK`, a front loader takes `SHOVEL`, and so on. When a map's fill type isn't a member of any category your gear accepts, nothing can harvest, haul, store, or sell it, and there's no in-game setting to fix it.

The **filltype bridge** solves this without editing a single vehicle. Silo generates a tiny standalone companion mod whose only job is to add the fill type into the categories you choose. It references the fill type *by name* and adds nothing else — no textures, no redefinition, no balance changes. It's a data-only mod, so it's multiplayer-safe as long as everyone in the session has it.

## When to reach for it

Use it when a map fill type simply won't work with equipment that should obviously handle it — your trailer won't fill, a silo won't store it, or a sell point doesn't list it. The classic case is a sugar-beet-style crop a map introduces that the base trailers ignore.

## Generate one

1. Click the **⛓ bridge** button in the stat bar. The **Filltype compatibility bridge** panel opens.
2. In **Fill type name(s)**, type the internal name(s), space- or comma-separated (for example `SUGARBEET BEETPULP`). Case doesn't matter; it's usually the crop or material name in caps. The chips below echo what Silo parsed.
3. Under **Add to**, pick the categories, grouped as *Haul &amp; load*, *Store &amp; sell*, and *Forage &amp; feed*. A sensible default is preselected (trailers, tippers, front loaders, farm silos, and bulk sell points).
4. Leave the **Mod name** as is or rename it — it must start with `FS25_`. This is the `.zip` filename.
5. Click **Generate bridge mod**.

Silo writes the `.zip` into your mods folder and rescans, so it appears in your library right away. Enable it, load your save, and the fill type should now work with the equipment in the categories you checked.

> **Reversible and low-risk.** The bridge only adds category membership — it never changes realism or economy. If two mods both define the fill type, load order still decides its properties. To undo it completely, just disable or delete the generated `.zip` . Silo won't overwrite an existing file: if a bridge of the same name is already there, generation stops and tells you.
