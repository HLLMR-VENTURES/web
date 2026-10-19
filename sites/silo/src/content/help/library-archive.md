---
title: "Moving your library archive to another drive"
label: "Moving your library archive to another drive"
summary: "Your library archive is where Silo keeps parked mods, sorted into category folders."
group: "Your library"
order: 4
legacyAnchor: "library-archive-h"
appliesTo: "0.11"
---
Your **library archive** is where Silo keeps parked mods, sorted into category folders. It starts inside your mods folder (`mods/archive/`), on the same drive. If that drive is filling up, you can move the archive to any other folder or drive — a big HDD, for example — while the mods folder stays where FS25 reads it. Only your active mods need to be in the game's folder; the rest of the library can live elsewhere.

> **New in v0.9.0.** If you don't see *Library archive* in Settings, update Silo.

## Moving it

1. Close Farming Simulator 25.
2. Open **Settings** → **Library archive**. It shows the current folder, labelled *Inside your mods folder (default)* or *Custom location*.
3. Click **Change…** and choose the new folder. Silo checks it, then asks you to confirm with the number of mods, their total size and (on another drive) the free space there.
4. Click **Move library**. A banner shows progress — how many mods have moved and how much data. When it finishes, Settings reads *Custom location* and your library looks exactly as before.

Silo refuses a folder that can't work and says why: it's already your archive, it's inside your mods folder, another mods folder already uses it, or the drive doesn't have room (Silo keeps 1 GB spare). Each mods folder has its own archive setting.

## Pause to play, then resume

A big library can take a while to move. While it runs, **Launch** is blocked. Click **Pause** on the banner and you can play right away — your active mods still load, including ones already moved. When you're done, close the game and click **Resume**. Silo won't move mods while the game is using them, so it refuses to start or resume while FS25 is open, and if you start the game yourself mid-move, the move pauses itself within a few seconds.

While a move is unfinished (running or paused), Silo doesn't change your library: Organize, activating and parking, Optimize links, switching mods folders and the archive controls are switched off (*"Finish or cancel the archive move first"*), and auto-filing waits.

## Cancelling

Click **Cancel move** and confirm. Mods already moved go back to where they were, and the setting stays unchanged. If some mods can't be moved, the move pauses and lists them with the reason — **Retry** tries them again, or **Cancel move** puts everything back.

## A folder that already has mods in it

If the folder you choose already holds loose `.zip` mods, Silo says so before the move and offers to file them in afterwards: a preview titled *File N mods into your library* shows where each one goes, and they arrive parked. Mods that are already in your library are listed and left untouched. Silo refuses a folder whose subfolders hold mods it doesn't manage, since those would mix with your library — choose another folder, or move those mods to the folder's top level so Silo can file them in.

## Active mods across drives

On the same drive, active mods are hardlinked into the mods folder, as usual. When the archive is on another drive, hardlinks aren't possible, so Silo uses a symlink where it can (Linux, macOS, and Windows with **Developer Mode** turned on) and a copy otherwise. Copies work just the same but use extra disk for your active set. On Windows without Developer Mode, the move's confirmation suggests turning it on, and **Optimize links** explains that active mods stay as copies. On a Mac App Store install, active mods are always copied: the sandboxed game can't follow a link outside its own folder.

## If the archive's drive is unplugged

Silo doesn't forget your library. A banner says *"Your library archive isn't available"*; parked mods are hidden until it's back, and active mods linked from it won't load in-game. Nothing is deleted. Your choices:

- **Retry** — after you reconnect the drive. Every parked mod comes back, in its category.
- **Choose another** — if you moved or restored the archive folder yourself, point Silo at it. Nothing is moved or copied; Silo just uses that folder (**Use this folder**).
- **Use default** (in Settings) — start fresh with the default archive inside your mods folder. Nothing is moved, and mods on the old drive stay there untouched.

## Moving it back

Settings → Library archive → **Use default** moves your library back into your mods folder, the same careful way. **Restore vanilla layout** also still works: it brings every mod back from the archive, wherever it is, into a plain flat `mods/` folder (the archive's drive has to be connected).

> **Built so a mod is never lost mid-move.** Silo copies each mod, verifies the copy, places it without ever replacing a file that's already there, and only then removes the original. Moved mods keep their dates. If Silo or your computer stops mid-move, the move is still there to resume or cancel next time.
