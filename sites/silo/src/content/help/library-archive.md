---
title: "Moving your library archive to another drive"
label: "Library archive"
summary: "Your library archive is where Silo keeps parked mods, and you can move it to another folder or drive."
group: "Your library"
order: 4
legacyAnchor: "library-archive-h"
appliesTo: "1.0"
---
Your **library archive** is where Silo keeps parked mods, sorted into category folders. It starts inside your mods folder, in `mods\archive`, on the same drive. If that drive is filling up, you can move the archive to another folder or drive, a big HDD for example, while the mods folder stays where FS25 reads it. Only active mods need to be in the game's folder.

You can choose another drive during the first-run setup, or later in **Settings**, then **Library**, on the **Library archive** card. The card shows the archive's folder, labelled **Inside your mods folder (default)** or **Custom location**, with **Open folder** and **Change…**.

## Moving it

1. Close Farming Simulator 25.
2. Open **Settings**, then **Library**, and click **Change…** on the **Library archive** card.
3. Pick the new folder. Silo checks it, then asks **Move your library to …?** with the number of mods, their size and, on another drive, the free space there.
4. Click **Move library**. A notice at the top shows how many mods have moved and how much data. When it finishes, the card reads **Custom location** and your library looks exactly as before.

Silo refuses a folder that can't work and says why: for example it overlaps your mods folder or another mods folder Silo knows, or the drive doesn't have room (Silo keeps 1 GB spare). Each mods folder has its own archive.

## Pause, resume and cancel

A big library can take a while. While the move runs, Play is blocked. Click **Pause** on the notice and you can play right away: your active mods still load, including ones already moved. When you're done, close the game and click **Resume**. Silo won't move mods while the game is using them, so it won't start or resume while FS25 is open, and a move pauses itself if you start the game mid-move.

While a move is running or paused, Silo leaves your library alone: organizing, switching mods on and off, switching mods folders and the archive controls wait, with the reason "Finish or cancel the archive move first".

**Cancel move** puts the mods already moved back where they were and keeps the old setting. If some mods can't be moved, the move pauses and lists them with the reason: **Retry** tries them again, or **Cancel move** puts everything back.

## A folder that already has mods in it

If the folder you pick already holds loose `.zip` mods, the confirmation says so, and after the move Silo offers to file them in: **File N mods into your library** shows where each one goes, and they arrive parked. Mods already in your library are left untouched. Silo refuses a folder whose subfolders hold mods it doesn't manage: choose another folder, or move those mods to the folder's top level so Silo can file them in.

## Active mods across drives

On the same drive, active mods are linked into the mods folder with no extra disk. Across drives Silo uses a symbolic link where it can (Linux, macOS, and Windows with **Developer Mode** on) and a copy otherwise. Copies work the same but use extra disk for your active mods. On Windows without Developer Mode, the move's confirmation suggests turning it on. On a Mac App Store install, active mods are always copied.

## If the archive's drive is unplugged

Silo doesn't forget your library. A notice says "Your library archive isn't available": parked mods are hidden until it's back, and active mods linked from it won't load in the game. Nothing is deleted.

- **Try again** after you reconnect the drive.
- **Choose another** points Silo at the archive folder if you moved or restored it yourself. Nothing is moved or copied.
- **Use default** on the card starts fresh with the default archive inside your mods folder. Mods on the old drive stay there, untouched.

## Moving it back

**Use default** on the **Library archive** card moves your library back into your mods folder, the same careful way. **Undo organizing** in **Settings**, then **Maintenance** also brings every mod back from the archive, wherever it is, into your mods folder (the archive's drive has to be connected).

> **Built so a mod is never lost mid-move.** Silo copies each mod, checks the copy, places it without replacing a file that's already there, and only then removes the original. If Silo or your computer stops mid-move, the move is still there to resume or cancel next time.
