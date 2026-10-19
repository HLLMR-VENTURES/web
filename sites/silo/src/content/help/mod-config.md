---
title: "A mod's own settings"
label: "Mod settings"
summary: "Many mods keep their options in a settings file, and Silo lets you change them from a form, with a backup before every save."
group: "Tools"
order: 17
legacyAnchor: "mod-config-h"
appliesTo: "1.0"
---
Many Farming Simulator 25 mods keep their own options in a small XML file that the game writes into the `modSettings` folder in your FS25 user folder, in a subfolder named after the mod. Silo can show that file as a form, so you can change a mod's options without hand-editing XML. A savegame's settings and the game's graphics have their own editors; see [Savegames](/help/savegames/).

## Finding a mod's settings

Mods with settings Silo can edit show a **Has settings** badge in the **Library**, and **Has settings** in the **Filters** popover lists just those. To open them:

- In the mod's details drawer, click **Settings**, beside the **Active** switch.
- Or right-click the mod's row, or use its **⋯** button, and choose **Edit settings…**.

If a mod has settings the game hasn't written yet, the drawer says Silo can edit them once the game writes them, usually after you play with the mod once.

## The Settings dialog

The dialog is titled with the mod's name. Each settings file gets its own section, headed by the file name, with one field per option:

- A true or false value becomes a switch.
- A whole number or a decimal becomes a number field.
- Anything else becomes a text field.

The labels are the mod's own setting names, as its author wrote them. Change what you want, then click **Save changes** under that file. The button stays off until you change something, and only the values you changed are written; the rest of the file stays as it was. "Saved" shows briefly when the write is done. **Close** or Esc leaves without saving.

## Raw XML

Each file has a **Raw XML** button that swaps the form for the file's exact text. Use it for anything the form doesn't cover. When Silo can't turn a file into a form at all, it says so and points you to **Raw XML**. **Save raw XML** writes your text back exactly as you typed it. Click **Raw XML** again to return to the form.

## Backups and undo

Silo won't save while Farming Simulator 25 is running, because the game writes settings back when it exits and your change would be lost. Close the game first.

Before every save, Silo backs up the file in the same folder:

- The first time, it keeps the file as it was as `<file>.xml.silo-original.bak`. That copy is never replaced.
- It also keeps the three versions before your latest edit as `.bak`, `.bak.2` and `.bak.3`.

If the backup can't be made, nothing is written. The new file is written beside the old one and swapped in only once it's complete, so a full disk or a permission error can't leave a half-written settings file. Silo only writes inside your FS25 user folder.

To undo a change, close the game, then copy the backup you want over the settings file. The `.bak` file is the version from just before your last save, and `.silo-original.bak` is how the file was before Silo first changed it. The dialog's footer repeats which backups Silo keeps.
