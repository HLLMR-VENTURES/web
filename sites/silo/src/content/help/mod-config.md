---
title: "Editing a mod's own config"
label: "Editing a mod's own config"
summary: "Many FS25 mods keep their own options in a small settings XML file that the game writes under modSettings/<ModName>/ in your FS25 user folder."
group: "Tools"
order: 16
legacyAnchor: "mod-config-h"
appliesTo: "0.11"
---
Many FS25 mods keep their own options in a small settings XML file that the game writes under `modSettings/<ModName>/` in your FS25 user folder. Silo's mod-config editor lets you change those values from a form instead of hand-editing the file. This is separate from editing your savegame or `game.xml` graphics/game settings, which have their own editor with a curated set of known options.

## Opening the editor

On a mod's row in your library, click the gear button (`⚙`, tooltipped *Edit this mod's settings*). It only appears for mods that actually have a settings file, so if you don't see it, that mod has nothing for Silo to edit yet. The panel opens with the mod's title at the top and **Mod settings** beneath it. If Silo finds no files, it says *No settings files found for this mod yet.*

## The generated form

For each settings file, Silo reads the mod's typed values and builds a field per option:

- A true/false value becomes a **toggle switch**.
- A whole number or decimal becomes a **number input**.
- Anything else becomes a plain **text box**.

Labels come from the mod's own setting names, so they read the way the mod author wrote them. Change what you want, then click **Save changes** — the button stays disabled until you've actually edited something. Only the values you changed are written back; the rest of the file is re-emitted exactly as it was read. A brief *saved ✓* confirms the write.

## Raw XML mode

Each file has a **raw XML** link in its header that swaps the form for a text area of the file's exact contents; the same link (now reading **form**) switches back. Use raw mode when you need to edit something the form doesn't cover — Silo will tell you when it *couldn't model this file as a form — use "raw XML" to edit it directly.* Click **Save raw XML** to write your text back verbatim.

## Safety and reversibility

> Every save is reversible. Before writing, Silo copies the current file to `<name>.xml.bak` in the same folder, and that backup must succeed or the save is aborted. The new content is written to a temporary sibling file and then atomically renamed into place, so a disk or permission error can never leave you with a half-written config — if the swap fails, the original is restored from the backup. Writes are confined to your FS25 user folder. To undo a change, restore the file from its `.xml.bak` .
