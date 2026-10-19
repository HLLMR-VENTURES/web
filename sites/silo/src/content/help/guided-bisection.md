---
title: "Guided bisection"
label: "Guided bisection"
summary: "Sometimes FS25 crashes or misbehaves and the log never names a mod."
group: "When something breaks"
order: 14
legacyAnchor: "guided-bisection-h"
appliesTo: "0.11"
---
Sometimes FS25 crashes or misbehaves and the log never names a mod. The cause is usually an *interaction* between mods that no single line can point to. Guided bisection automates the community ritual for these cases — disable half your mods, relaunch, see if the problem survives, and repeat — so Silo does the bookkeeping and you just play and report what happened.

Instead of testing mods one at a time, it halves the suspect list every round. A library of, say, 60 active mods is isolated in roughly six launches rather than sixty.

## When to reach for it

Open the **◆ diagnose** panel (Crash &amp; log triage) after a bad run. If Silo can tie the crash to a specific mod, it lists that mod directly and you don't need bisection. If the log shows an abnormal exit but *no* mod logged an error first, the panel says the cause is likely an interaction and offers **◆ Run guided bisection**. There's also a **Run guided bisection →** link for something misbehaving that the log doesn't explain even after a clean exit. You need at least two active non-map mods for the button to enable.

## The loop you'll follow

1. Press **Start**. Silo tells you the mod count and roughly how many launches to expect.
2. Each round it applies a test half (the rest are temporarily off) and shows **Round N** with how many launches remain at most.
3. Press **▶ Launch FS25**, load the save that was breaking, try to reproduce the problem, then quit to desktop.
4. Back in Silo, press **I've quit the game →**. Silo peeks at the log and hints whether it looks like another crash or a clean exit.
5. Answer the verdict: **Still broken** or **It's fine now**. Silo narrows to the guilty half and sets up the next round.

It ends one of two ways. **Most likely culprit** names a single mod — disable or update it, or report the pairing to its author if it only breaks alongside another mod. **No single mod is at fault** means every half came back clean, so the problem is a combination (or isn't mod-related). Silo reports this honestly rather than blaming an innocent mod.

## Safety and reversibility

> Bisection is crash-safe. Before it changes anything, Silo snapshots your exact active set. It's restored automatically when you reach a result, when you press **Restore my mods &amp; finish** , or when you cancel with the **✕** (Cancel &amp; restore). Only your maps stay on every round, so your save still loads. Silo doesn't keep a mod's dependencies switched on with it yet, so if a round fails because a required mod was off, treat that round's result with care. If the app closes mid-run, the next time you open Silo a banner offers **Restore my mod set** — your originals are never lost.
