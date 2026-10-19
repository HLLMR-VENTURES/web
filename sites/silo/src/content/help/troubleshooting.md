---
title: "Troubleshooting & FAQ"
label: "Troubleshooting & FAQ"
summary: "Still stuck?"
group: "Settings & FAQ"
order: 21
legacyAnchor: "troubleshooting-h"
appliesTo: "0.11"
---
**Still stuck?** Ask in [Silo Discussions](https://github.com/HLLMR/silo/discussions/categories/help) or on the [Silo Discord](https://discord.gg/NpxcYdGHrW). Include your Silo version (bottom of Settings), the file from **Settings → Export report**, and for a crash your FS25 `log.txt`. Confirmed bugs go to [GitHub issues](https://github.com/HLLMR/silo/issues/new/choose).

## Windows SmartScreen (or macOS Gatekeeper) warns on first launch

Silo's **Windows** installers are digitally signed by Silo's developer, **David Hellmer**, so Windows can identify who published them. SmartScreen builds reputation per release, so a brand-new build may still prompt. When it does, it shows that publisher instead of "unknown". macOS and Linux builds are open source and not signed with an OS certificate, so Gatekeeper blocks the first launch on a Mac.

- **Windows:** click **More info**, then **Run anyway**.
- **macOS:** open Silo once, then go to **System Settings → Privacy &amp; Security** and click **Open Anyway**.

You don't have to take our word for it — you can [verify the signature, checksum, and build provenance](https://github.com/HLLMR/silo/blob/main/docs/VERIFY_DOWNLOAD.md), or read and build the source yourself from the GitHub repository.

## Do I need Developer Mode or administrator rights?

Almost never. When you organize your library, Silo tucks each mod into a `mods/archive/<Category>/` subfolder (the game only reads the flat root, so it ignores these) and projects the active set back into the root:

- **Packed `.zip` mods project as hardlinks** — same volume, no admin, no Developer Mode, and no second copy on disk.
- **Only unpacked folder-mods** use a directory link. On Windows that's a junction, which needs no admin rights. If no link is possible, Silo falls back to a plain copy.

Since most mods are zips, most people never hit an elevation prompt. The one exception is a [library archive on another drive](/help/library-archive/): hardlinks can't cross drives, so Silo would need file symlinks, which on Windows require Developer Mode. Without it, active mods are copied instead — that works, it just uses more disk.

## Is my library safe? Can I undo this?

Yes. Organize shows you every move before it touches a file. To undo it all, open **Settings** and use **Restore vanilla layout** to move every mod back into a plain flat `mods/` folder and clear Silo's bookkeeping. The game then loads every mod in that folder, including the ones you had parked. Mod updates keep the previous version in `backups/`.

> Silo never deletes a file it doesn't recognize and never removes the only copy of a mod. If you swap your own build into the mods folder, Silo detects that it isn't the file it projected and leaves it untouched. Config edits are backed up to a `.bak` first.

## Where does Silo store its data?

Your mods stay in your game's mods folder — Silo only rearranges them — or in your library archive, if you moved it to another folder or drive. Silo's own database (`silo.db`: the library index and cache) lives in the app's per-user data directory. Any account tokens go into your OS credential store (Windows Credential Manager, macOS Keychain, Linux Secret Service). On a Linux system without a keyring, Silo stores the token in its own database instead.

## Why does a mod show "Unverified"?

The **Integrity** check in a mod's detail drawer compares your file against the trusted build SiloAPI hashed from its source. **Unverified** means there's no hashed build to compare against: the mod isn't in the catalog, or the catalog hasn't hashed that version (new ModHub versions currently aren't hashed). It is not a warning about the mod. Folder mods can't be verified at all (there's no archive to hash). This is a provenance check, not a virus scan.

## Connecting a GitHub account

Connecting GitHub is optional and lives in **Settings → GitHub account → Connect GitHub**: a browser opens to `github.com/login/device`; type in the code shown. This raises update-check limits to 5,000 requests per hour. Star/Watch and publishing [collections](/help/collections/) each need one more permission, which Silo asks for when you turn them on (see [Connecting GitHub](/help/settings-accounts/)). Silo never asks for access to private repositories. The token stays on your machine, and a **Disconnect** button removes it at any time.
