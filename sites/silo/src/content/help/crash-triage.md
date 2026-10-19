---
title: "Crash & log triage"
label: "Crash & log triage"
summary: "When Farming Simulator 25 crashes or misbehaves, it leaves an explanation in a file called log.txt — but that file is thousands of lines of engine chatter, and most of it is harmless."
group: "When something breaks"
order: 13
legacyAnchor: "crash-triage-h"
appliesTo: "0.11"
---
When Farming Simulator 25 crashes or misbehaves, it leaves an explanation in a file called `log.txt` — but that file is thousands of lines of engine chatter, and most of it is harmless. Silo's **diagnose** feature reads that log for you, tells you whether the last run actually crashed, and ranks the mods by the errors they logged during that run, most errors first, so you can see the likely culprit. It separates the real breakage from the cosmetic noise that scares people for no reason.

The usual community advice is to manually disable half your mods and relaunch over and over. Silo starts by simply reading the name the engine already wrote next to each error.

## When to use it

- Right after the game crashes to desktop, freezes on load, or quits unexpectedly.
- When something in-game is clearly broken and you want to know which mod is complaining.
- Any time you just want a quick health check on your last session.

## How to open it

In the stat bar, click the **◆ diagnose** button. Silo reads `log.txt` from your FS25 user folder and shows a report. Use **↻ Re-read log** to refresh it after another launch.

> This feature only *reads* your log — it never edits `log.txt` , your mods, or any game file. There is nothing to undo. It is completely safe to run as often as you like.

## How to read the result

The headline verdict comes in one of three forms:

- **Healthy** — the last run exited cleanly and no mod logged a real error. If anything appears, it is cosmetic only. Nothing to do.
- **Exited cleanly, but…** — the game closed normally, yet one or more mods logged errors worth a look. Not necessarily a crash, but worth checking.
- **The last run ended abnormally** — the log stops mid-session with no clean-exit marker. That is what a crash looks like.

Below the verdict, mods are grouped by severity:

- **Likely culprits** — mods that logged genuine errors (for example Lua script failures). Each row shows the mod's name, its error and warning counts, and a sample log line.
- **Worth a look** — mods with real warnings but no errors.
- A collapsed **cosmetic warnings only — safe to ignore** group, tucked away because missing-translation notices and the like never cause a crash.

Silo only blames a mod when the log names it directly (via its `mods/` path or an `in mod '…'` clause) — it never guesses. Anything it can't attribute is counted as engine or base-game and reported separately, with an **Open log.txt** link so you can read the raw lines yourself.

If the run crashed but no mod is named, the log genuinely can't identify the cause — usually a mod interaction. In that case Silo offers **Run guided bisection** to isolate it automatically. See the guided bisection section for that workflow.
