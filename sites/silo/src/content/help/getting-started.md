---
title: "Getting started"
label: "Getting started"
summary: "Silo is a desktop app for managing your Farming Simulator 25 mods."
group: "Getting started"
order: 1
legacyAnchor: "getting-started-h"
appliesTo: "0.11"
---
Silo is a desktop app for managing your Farming Simulator 25 mods. It is **not an in-game mod** and you don't install it into the game — it's a standalone program that runs on your computer alongside FS25. It scans your existing mod library, organizes it, catches conflicts before you launch, triages crashes, and tracks updates.

Silo never edits the game itself. It works with the files FS25 already keeps in `Documents\My Games\FarmingSimulator2025\`. Organize shows you every move before it touches a file. Restore vanilla layout puts every mod back in your mods folder.

## Installing on Windows

1. Download the latest installer from the [Releases page](https://github.com/HLLMR/silo/releases) (also linked from [silo.hllmr.com](/)). You'll find a setup `.exe` and an `.msi`. We recommend the setup `.exe`.
2. Run it. The setup `.exe` installs Silo for your user account and doesn't need administrator rights. The `.msi` installs it for all users of the PC and asks for administrator rights.

> **A blue "Windows protected your PC" prompt can still appear on a brand-new release.** Silo's Windows installers are digitally signed by Silo's developer, **David Hellmer** , so the prompt names that publisher instead of "unknown". SmartScreen builds reputation per release, so a very fresh build may still prompt. If it does, click **More info** , then **Run anyway** . You can [verify the signature yourself](https://github.com/HLLMR/silo/blob/main/docs/VERIFY_DOWNLOAD.md) first.

## Installing on macOS (preview)

1. Download the `.dmg` for your Mac (Apple Silicon or Intel) from the [Releases page](https://github.com/HLLMR/silo/releases), open it and drag Silo to Applications.
2. The macOS build isn't signed by Apple, so the first launch is blocked. Open Silo once, then go to **System Settings → Privacy &amp; Security**, scroll down and click **Open Anyway**.

## Installing on Linux (preview)

- **AppImage:** make it executable (`chmod +x Silo_*.AppImage`) and run it.
- **Debian / Ubuntu:** `sudo apt install ./Silo_*.deb`
- **Fedora / openSUSE:** install the `.rpm` with your package manager, for example `sudo dnf install ./Silo-*.rpm`.

## What happens on first run

When Silo opens it lands on the **Library** view and looks for your FS25 mods folder automatically — on Windows that's `Documents\My Games\FarmingSimulator2025\mods`, unless FS25 has been set to use another folder, in which case Silo follows the game's setting. If it finds one, it starts scanning right away; a progress bar shows how many mods it has read. The first scan of a large library takes a little while, and later scans are much quicker.

When the scan finishes you'll see your whole library, with counts for mods, maps, and scripts. You can confirm which folder Silo found under **Settings** (the gear icon), in the **Mods folder** section, and pick a different one with **Change…** (see [Choosing your mods folder](/help/mods-folder/)). If nothing was found, the list reads *"No mods found yet. Point Silo at your mods folder and rescan"* — check that the folder exists, then use the **Rescan** button.

## Your files stay safe

Silo is built so it never changes your original mod files destructively. On first run it only reads and catalogs. It moves nothing until you ask. When you organize or activate mods, Silo links them into the game's `mods/` folder (hardlinks for `.zip` mods, junctions or symlinks for folder mods), so there's no duplication and your originals are untouched. The **Restore vanilla layout** button in Settings puts every mod back in your mods folder at any time. Your mods are never deleted, but after a restore the game loads all of them again, including the ones you had parked.

> **If your `Documents` folder is synced by a cloud service** — OneDrive, Google Drive, or Proton Drive — that service presents files as on-demand placeholders and won't allow hardlinks. Silo detects this on first run and shows a one-time notice: it will project your active mods as **file copies** instead of links. Everything still works and nothing is lost, but the active set uses extra disk and bulk activate/deactivate is slower. Excluding `…\My Games\FarmingSimulator2025` from your cloud sync lets Silo use hardlinks again — see [Library layout &amp; maintenance](/help/settings-accounts/) .

> **macOS and Linux are a preview.** Silo is built and tested Windows-first. It runs natively on macOS and Linux: on Linux it finds FS25's folder inside the Steam Proton prefix (native or Flatpak Steam), and on macOS it handles Steam, GIANTS and Mac App Store installs. This hasn't been tested on many real machines yet, so expect rough edges — and reports are very welcome.
