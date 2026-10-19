---
title: "Choosing your mods folder"
label: "Choosing your mods folder"
summary: "By default FS25 reads Documents/My Games/FarmingSimulator2025/mods/, but the game can be told to use another folder (its mods directory override in gameSettings.xml)."
group: "Your library"
order: 3
legacyAnchor: "mods-folder-h"
appliesTo: "0.11"
---
By default FS25 reads `Documents/My Games/FarmingSimulator2025/mods/`, but the game can be told to use another folder (its *mods directory override* in `gameSettings.xml`). Silo follows that setting automatically: if FS25 is set to another folder, Silo uses it too and tells you once — *"Silo now uses the mods folder FS25 is set to: …"*. You can also pick any folder yourself, for example one on a bigger drive.

## Where to find it

Open **Settings** (the gear) → **Mods folder**. It shows the folder Silo is using and where that choice came from: *FS25 default*, *Following FS25's setting*, or *Chosen in Silo* (with *not available* added if the folder can't be reached). **Open ↗** reveals it in your file manager.

## Picking another folder

1. Click **Change…** next to *Mods folder* and choose a folder. If it holds no mods yet, Silo asks first — **Use this folder** or **Cancel**.
2. Silo switches to it and rescans. If FS25 still reads a different folder, Silo asks *"Point Farming Simulator at this folder too?"*:
   - **Update FS25's setting** — Silo writes the new folder into FS25's `gameSettings.xml`, keeping a backup of the original as `gameSettings.xml.bak`. Close FS25 first: the game rewrites that file when it exits.
   - **Only in Silo** — leave the game alone. Use this when you just want to look at or tidy another folder.

Changing folders waits for a running scan or task to finish, and isn't allowed during a guided bisection (finish or cancel it first — it belongs to the folder it started in).

## When Silo and FS25 disagree

If Silo and the game end up reading different folders, a banner says *"FS25 is reading a different mods folder — mods you activate here won't load in-game."* Pick one:

- **Point FS25 here** — update the game's setting to Silo's folder (with the same `.bak` backup).
- **Switch Silo to the game's folder** — go back to whatever FS25 reads.

When you've chosen a folder in Silo, Settings also offers **Use the game's folder** to undo that choice.

## Several folders, each with its own library

Silo remembers how each folder is organized separately. Switching to another folder and back restores that folder's library exactly as you left it. Folders you've used before are listed under *Other folders Silo knows* in Settings, with their mod counts — click one to switch.

## If the folder goes missing

If a folder you chose can't be found (an unplugged drive, a renamed folder), Silo scans nothing and shows *"Your mods folder isn't available"* with **Retry**, **Choose another**, and **Use the game's folder**. If FS25 simply hasn't created its `mods` folder yet, you'll see **Create it** or **Choose a folder** instead.

> On **Linux** , FS25 runs through Steam Proton and stores its setting as a Windows-style path; Silo translates it to the real folder through the Proton prefix. If Silo can't map the path to a folder on your computer, Settings says so — choose the folder with **Change…** .
