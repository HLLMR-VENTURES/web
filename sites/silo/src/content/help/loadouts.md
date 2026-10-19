---
title: "Loadouts"
label: "Loadouts"
summary: "A loadout is a named set of active mods you can switch to in one click."
group: "Your library"
order: 6
legacyAnchor: "loadouts-h"
appliesTo: "0.11"
---
A **loadout** is a named set of active mods you can switch to in one click. If you run several playthroughs — a heavy-realism seasonal save, a lightweight co-op save, a clean vanilla-ish test — each wants a different mix of mods active. Instead of hand-toggling dozens of mods every time you change games, you save each mix once and apply it when you need it.

Loadouts store the *list* of active mods, not the mod files themselves. Deleting a loadout never touches your mods, and applying one never deletes anything from your library — it only changes which mods are projected into the game's `mods/` folder.

## Opening the panel

Click **Loadouts** in the top bar to open the Loadouts panel. When your current active set exactly matches a saved loadout, that button shows the loadout's name with a dot (for example `● Seasons Co-op`) instead of the word "Loadouts". The panel header shows how many mods are currently active.

## Saving a loadout

First activate the mods you want (toggle them in the library, or use the filter + select-all to build a set quickly). Then, in the Loadouts panel, click **+ Save current active set as a loadout** and give it a name. The set is saved as-is. This button is disabled while nothing is active.

To update an existing loadout to match what you have active now, click its **overwrite** icon (⭯, "Overwrite with current active set").

## Applying a loadout

Click a loadout's name to apply it. Silo makes the game's active set *exactly* that loadout: it links in the mods that should be active and removes the links for mods that shouldn't be. The filled dot moves to the loadout you just applied.

> Applying is reversible and safe. Silo only adds or removes its own projected entries (junction, symlink, hardlink, or marked copy) in the `mods/` folder — your archived source files are never moved or deleted. If it finds a file it didn't project (you swapped in your own build), or the archived copy behind a link is missing, it leaves that file alone and reports it rather than deleting it.

## Building a loadout from a savegame

In the Savegames panel, click **→ Loadout** next to a save to build a loadout from the mods that save actually used. Silo creates a loadout named after the save from the mods you have, notes any that are missing, and applies it — a fast way to bind the right mods to the right playthrough.

## Exporting and importing

Click a loadout's **export** icon (⇪) to save it as a `.silo` file — a small JSON file listing the loadout's name and mod tech-names (no mod ZIPs are included). Share that file, and the recipient clicks **↧ Import a .silo file** to add it as a new loadout (`.silo` or `.json` accepted). Import only creates the loadout entry; the person still needs the actual mods in their library for every mod to activate.

## Deleting

The **✕** icon removes a loadout after a confirm. As the prompt says, your mods aren't affected — only the saved set is discarded.
