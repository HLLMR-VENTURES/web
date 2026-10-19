---
title: "Savegame & settings editing"
label: "Savegame & settings editing"
summary: "Silo can edit two FS25 configuration files for you without launching the game: a career save's careerSavegame.xml (difficulty and gameplay rules) and the global game.xml (graphics and performance)."
group: "Tools"
order: 15
legacyAnchor: "savegames-h"
appliesTo: "0.11"
---
Silo can edit two FS25 configuration files for you without launching the game: a career save's **careerSavegame.xml** (difficulty and gameplay rules) and the global **game.xml** (graphics and performance). Both are plain XML that the game normally only lets you touch through in-game menus. Reach for this when you want to dial in difficulty before you start playing, drop graphics to chase frame rate, or copy the same settings across saves quickly.

## Editing a savegame's settings

Open the **Savegames** panel from the top bar. Each row shows the save's name, its slot and map, and how many of its mods are in your library. Click **Configure** to open the editor for that save.

The editor lists a curated, safe subset of fields — *Save name*, *Economic difficulty*, *Growth*, *Fuel usage*, *Dirt interval*, *Time scale*, *Autosave interval*, and toggles for crop destruction, plowing required, stones, weeds, lime, snow, traffic, and whether helpers buy their own fuel, seeds, and fertilizer. Two **Presets**, *Casual* and *Realistic*, fill several fields at once; you can still adjust anything afterward. Silo edits only the values you change and leaves the save's internal fields alone.

## Editing graphics &amp; performance

Open **Settings** (the gear, top right), find **Graphics &amp; performance**, and click **Edit game.xml ↗**. Fields include *Performance class*, *Anisotropic filtering*, *Shadow map size*, *Max shadow lights*, *Soft shadows*, *FSR upscaling*, *Volumetric fog*, *Cloud shadows*, and *V-Sync*, with *Performance*, *Balanced*, and *Quality* presets. Graphics changes take effect the next time you launch the game.

## Saving changes

In either editor, **Save changes** stays disabled until you actually change something, then writes your edits and briefly shows *saved ✓*. Close the panel any time with the ✕ to discard unsaved edits.

> **Every save is reversible.** Before overwriting a file, Silo copies the original to a `.bak` file beside it (for example `game.xml.bak`) — and if that backup can't be made, the write is aborted rather than risking your file. The new file is then swapped in atomically, so a disk or permission error can't leave a half-written config. To roll back, delete the edited `.xml` and rename the `.bak` back. Writes are confined to your FS25 user folder.

For a full snapshot of a career before you experiment, use **Back up** in the Savegames panel. It copies the entire savegame folder into a `SiloBackups` folder in your FS25 user directory, timestamped, leaving the original untouched.
