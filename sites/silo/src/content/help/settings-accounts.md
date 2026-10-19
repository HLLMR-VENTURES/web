---
title: "Settings & accounts"
label: "Settings & accounts"
summary: "Open the Settings panel from the gear icon (⚙) in the top bar."
group: "Settings & FAQ"
order: 20
legacyAnchor: "settings-accounts-h"
appliesTo: "0.11"
---
Open the **Settings** panel from the gear icon (`⚙`) in the top bar. It slides out on the right and covers appearance, your detected folders, account connections, diagnostics, and library layout. Nothing here changes your game files until you press a specific button. Organize shows a preview first, and Restore vanilla layout asks you to confirm.

## Appearance

Under **Appearance**, pick **system**, **light**, or **dark**. *System* follows your OS theme; the other two force that look. Your choice is saved and reapplied on the next launch.

## Folders

**Mods folder**, **Library archive** and **Game** show the paths Silo is using, each with an **Open ↗** link to reveal it in your file manager. **Mods folder → Change…** picks another mods folder (see [Choosing your mods folder](/help/mods-folder/)), and **Library archive → Change…** moves your parked mods to another folder or drive (see [Moving your library archive](/help/library-archive/)). If the game install isn't found, the Launch button is hidden. When your user directory is known, **Graphics &amp; performance** offers **Edit game.xml ↗** to tune presets (Performance / Balanced / Quality) without starting the game.

## Diagnostics — Export report

**Export report ↗** writes a shareable Markdown file (`silo-report.md`) summarizing your environment, library counts by category, active set, detected conflicts, and health issues. Reach for it when asking for help or comparing setups. It only reads your library and saves a text file — it changes nothing.

## Auto-file new mods

This toggle is **off** by default. When on, Silo moves newly-downloaded `.zip` mods into your library after each scan and keeps them active, so you skip the manual Organize step. It files them without a preview. Leave it off if you prefer to review new downloads first. The setting is remembered between sessions.

## Library layout &amp; maintenance

Under **Library layout**:

- **Organize** sorts your `.zip` mods into `mods/archive/<Category>/` subfolders (which the game ignores), or into your library archive if you moved it, and projects the active set back via hardlinks — no duplication, with a preview first.
- **↻ Rebuild categories** re-scans every mod from scratch. Use it after a Silo update improves categorization so existing mods pick up the better categories.
- **⛓ Optimize links** appears when mods are organized on a normal (non-cloud) drive. It collapses any active mod that ended up projected as a full copy back into a hardlink — reclaiming the duplicated disk and making activate/deactivate faster. It only touches files byte-identical to the archived copy, never a build you swapped in. On a cloud-synced folder this is replaced by a short note explaining that copies are used because the drive can't do hardlinks. If your library archive is on another drive and Windows can't link across drives (no Developer Mode), it says so and changes nothing.
- **Restore vanilla layout** appears only when mods are organized. It moves every mod back out of `archive/` and removes all links, returning you to a plain flat `mods/` folder. You'll confirm first. Afterwards the game loads every mod in that folder, including the ones you had parked.

> Restore vanilla does **not** delete any mods. It only undoes Silo's organization. A copied folder mod you edited is moved to `backups/` instead of being deleted. If some files can't be moved, Silo reports the errors rather than leaving things half-done.

## Connecting GitHub

Under **GitHub account**, press **Connect GitHub**. A browser opens to **github.com/login/device**; enter the code Silo shows and authorize. Silo asks GitHub only for the permissions a feature needs:

- **Connect GitHub** grants `read:user` (your username). That gives faster update checks (5,000 requests per hour instead of 60).
- **Enable actions** adds `public_repo`, so *Star* and *Watch* land on your account and you can publish a public collection.
- **Enable collection sharing** adds `gist`, so you can publish a private (secret gist) [collection](/help/collections/).

In-app GitHub installs from the Browse tab work without connecting. You can **Disconnect** anytime, or use a Personal Access Token instead via the token option.

The panel footer shows your installed Silo version.
