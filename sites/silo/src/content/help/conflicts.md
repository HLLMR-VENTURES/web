---
title: "Conflict detection"
label: "Conflict detection"
summary: "Some mods can't coexist."
group: "When something breaks"
order: 12
legacyAnchor: "conflicts-h"
appliesTo: "0.11"
---
Some mods can't coexist. Two of them may claim the same slot, or one may silently overwrite another's settings — and you won't find out until the game crashes on load or an item behaves oddly. Silo re-parses the `modDesc.xml` of every mod in your **active set** and flags these collisions before you launch, so you can fix them while it's still a two-second edit.

## What Silo checks for

- **Duplicate active map** (critical) — more than one map enabled at once. FS loads a second map's scripts even when it isn't the one you're playing, which can cause errors when the game loads. Keep exactly one map active.
- **uniqueType collisions** (critical) — two mods share a `uniqueType`. FS loads only one, so the others never take effect.
- **Specialization / type / registration collisions** (critical) — multiple mods register the same specialization, vehicle type, placeable type, input action, brand, or store category. Only one registration wins; the others may break.
- **Script collisions** (warning) — two mods inject a global Lua script with the same filename; they can override each other by load order. If the file is byte-identical in each mod, Silo downgrades it to *info* — it's a shared library, not a real fight.
- **Cross-mod fillType override** (warning) — two mods define the same-named `fillType`. Whichever loads last silently overrides the other's capacity, price, and other settings.

When every mod in a clash shares the same author, Silo treats it as likely intentional and softens the severity, so the critical list stays trustworthy.

## Reading the conflicts panel

The stat bar shows a **conflicts** button with a live count; it turns red when any conflict is critical. Click it to open **Conflicts in the active set**. The header shows how many are critical. Each row lists its **severity** (critical, warning, or info), the **kind** of collision, the offending **name**, the **mods involved**, and a plain-language explanation of what breaks. Rows are ordered critical first.

To see the culprits in your library, use the **⚠ In conflict** filter in the stat bar — it narrows the list to just the mods named in a conflict.

## Resolving a conflict

1. Decide which mod in the clash you want to keep.
2. In the library, click the status toggle on the other mod's row to **park** it (an active mod reads `● Active — click to park`).
3. Silo re-checks the active set automatically after any change, so the count updates on its own — no rescan needed.

> Parking never deletes a mod. It removes the mod's link from the game's `mods/` folder right away. The mod stays in your library, and one click reactivates it.
