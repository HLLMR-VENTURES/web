---
title: "Multiplayer mod-set sync"
label: "Multiplayer mod-set sync"
summary: "Everyone in an FS25 session needs the same mods, at the same versions, with the same files."
group: "Tools"
order: 17
legacyAnchor: "multiplayer-h"
appliesTo: "0.11"
---
Everyone in an FS25 session needs the same mods, at the same versions, with the same files. A mismatch is a common reason a join fails, and it can take a while to work out *which* mod is wrong. Silo turns that guessing game into a checklist: the host publishes a hashed list of their active set, and each joiner checks their own set against it.

Open it from the **Multiplayer** button in the top bar. The panel has two sides: **Host — share your set** and **Joiner — check you match**. Both act only on your current *active set* (the mods Silo has switched on).

> This whole feature is read-only for your mods. It hashes files and writes one manifest file where you choose. It never changes your active set, your mods, or your game files — you make any fixes yourself.

## Host: export your set

Click **Export active set →**. Silo hashes each active zip mod (recording its name, version, content hash, and size), then prompts you to save a `.silomp` file (default `my-modset.silomp`). You'll see a note like "Saved a manifest of N mods." Send that file to everyone joining — over Discord, email, or a shared folder. Re-export whenever you change your loadout so the manifest stays current.

## Joiner: verify against the host's manifest

Click **Verify against a manifest…** and pick the `.silomp` file the host sent. Silo hashes your active set, compares it, and shows either **"Your set matches. You're clear to join."** or **"Your set doesn't match yet."** with a grouped fix-list:

- **Get these** — the host has them, you don't. Add each mod.
- **Wrong version** — shows "yours X → need Y". Update to the host's version.
- **Same version, different file** — the version matches but the bytes differ. Re-download to be safe.
- **Turn these off** — you have mods the host doesn't. Disable them for this session.

Work through the list, then click **Verify against a manifest…** again to confirm you're clear.

## What Silo can and can't check

The comparison is byte-strict: a re-zip with identical contents still reads as different, so Silo errs toward "re-download to be sure" — the safe direction for multiplayer. Unpacked folder mods (dev mods) can't be byte-verified; if any are active you'll see a caveat, and they're marked unmatched in a manifest. For clean verification, use packed `.zip` mods on both sides.
