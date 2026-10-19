---
title: "Mod integrity & provenance"
label: "Mod integrity & provenance"
summary: "The integrity check answers one question: is this the mod its author published, or has it been altered since?"
group: "Finding & verifying mods"
order: 11
legacyAnchor: "provenance-h"
appliesTo: "0.11"
---
The integrity check answers one question: **is this the mod its author published, or has it been altered since?** It hashes the archive you have installed and compares it to the canonical build that SiloAPI computed from the mod's own source. Reach for it when a mod came from somewhere other than its official page, when an update behaves unexpectedly, or when you simply want to confirm that what's on disk is exactly what shipped.

> This is provenance, not antivirus. A **Verified** result confirms origin and integrity — that the files match the published build. It does not judge intent, and it cannot tell you whether a mod is *safe* . The check only reads and hashes files; it never writes, moves, or modifies anything, so running it is always safe to do.

## Running the check

Open a mod's **detail drawer** and find the **Integrity** section, then click **Verify integrity**. Silo hashes the archive on a background thread (you'll see *Hashing &amp; comparing…*) and shows one of three verdicts. Only packaged mods can be checked — for an unpacked folder you'll see *Folder mods can't be verified — there's no archive to hash.*

## The three verdicts

- **Verified** — the mod matches the published build. Either a byte-for-byte match with the exact archive, or a content match (repackaged, but every file inside is identical). The matched version is shown.
- **Modified from the published build** — it's the same mod, but files differ. You get a count of *changed / added / removed* and expandable lists naming the **exact files**. This tells you precisely what diverged — it does not, by itself, mean the change is malicious. Long lists are capped with a *+N more* line.
- **Unverified** — there's no hashed canonical build to compare against yet, so no conclusion can be drawn either way. You'll see why: the mod isn't in the catalog, or there's no hashed build for this exact version yet.

After a Modified or Unverified result you can click **Re-check** to run it again. Verified and Modified verdicts also show as a small badge on the mod's row until you close Silo.

The hashing and the comparison happen on your computer. To fetch the published build's file list, Silo sends the catalog only the mod's tech name and version.

## What it can check

Silo can check mods from GitHub, and ModHub mods whose build the catalog has already hashed. New hashed builds currently come from GitHub releases only, so a new ModHub version usually shows **Unverified**. An **Unverified** result is never a mark against a mod. It only means Silo has nothing on file to compare it to.
