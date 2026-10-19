---
title: "Problems in your library"
label: "Problems"
summary: "Diagnose, Problems lists the mods that can't load as they are, whichever mods you have switched on, and what to do about each one."
group: "When something breaks"
order: 13
legacyAnchor: "health-h"
appliesTo: "1.0"
---
**Diagnose**, then **Problems** lists the mods in your library that can't load as they are. It looks at your whole library, active and parked, so it answers a different question from [Conflicts](/help/conflicts/), which only looks at how your active mods clash with each other. Reach for it when a mod you expected never shows up in the game, or after a batch of installs and updates.

## Opening it

Click **Diagnose** in the left rail (or press Alt+4) and choose the **Problems** tab. The number on the tab is how many mods need attention. The header status chip also counts them: an active mod with a problem counts as a **problem**, and a parked one, or a different build waiting in your mods folder, counts as **to review**. When nothing is wrong, the tab says every mod in your library can load.

Opening the tab changes nothing. Only the buttons on each row act, and each one says what it does.

## What it reports

Each kind of problem has its own group, with a count:

- **Missing a required mod**: the mod's `modDesc.xml` says it needs another mod that isn't in your library, so the game won't load it. **Find it in Browse** searches for the missing mod. This checks whether the required mod is in your library at all, not whether it's active. A mod's details also list what it needs, with **Missing** next to anything you don't have.
- **Can't be read**: Silo couldn't open the file, so the game probably can't either. The row shows the reason. This usually means a damaged or interrupted download. **Show file** opens its folder, and **Park** (for an active mod) stops the game trying to load it. Download the mod again to fix it for good.
- **Ignored by the game: the name starts with a digit**: Farming Simulator skips any mod whose file name starts with a number, so it looks installed but never runs. Renaming the file would change its Mod ID, so the better fix is to ask its author for a corrected build. **Show file** opens its folder.
- **A different build is in your mods folder**: the file in your mods folder isn't the one Silo keeps for that mod. Almost always this is a newer version you saved there yourself, which is how ModHub updates arrive. The row shows both versions. **Use this version** makes the file in your mods folder the one Silo keeps. **Keep Silo's** puts Silo's copy back. Either way the other build is moved to `backups/`, so nothing is lost. The same choice appears as a banner in the mod's details, and in **Updates** (see [Keeping mods updated](/help/updates/)).

Library writes are switched off while something else is changing your library, such as a mod set switch or a library archive move. The affected buttons then say why.

## Keeping it current

The list comes from Silo's last reading of your library. Silo reads it again when you come back to the window, and F5 rescans on demand, so a fixed problem drops off the list on its own.
