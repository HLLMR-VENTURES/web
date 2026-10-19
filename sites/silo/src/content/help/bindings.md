---
title: "Bindings map"
label: "Bindings map"
summary: "The Bindings map shows the complete control layout in one place: every action paired with the key, mouse button, or gamepad button that triggers it."
group: "Tools"
order: 19
legacyAnchor: "bindings-h"
appliesTo: "0.11"
---
The **Bindings map** shows the complete control layout in one place: every action paired with the key, mouse button, or gamepad button that triggers it. Silo reads this straight from the game's own `inputBinding.xml` and lays it out so you can scan it in one place.

## When to reach for it

Open it when a control feels double-booked — you press a key and two things happen, or a mod's action seems to collide with a base-game one. It is the fastest way to answer "what is *everything* this key does?" without hunting through the settings menus one action at a time.

## Opening it

1. Find the **⌨ bindings** button in the stat bar near the top of the main window.
2. Click it. Silo reads `inputBinding.xml` from your FS25 user folder and opens the **Control bindings** panel.

If you have never launched FS25, there is no bindings file yet and Silo tells you so: *"No inputBinding.xml found — launch FS25 at least once first."* Start the game once, set your controls, and try again.

## What you'll see

The header shows totals — how many actions, bindings, and devices were found. Below that, bindings are grouped by device (typically **Keyboard &amp; Mouse** and **Gamepad**). Each device has up to two parts:

- **Inputs bound to more than one action** — a highlighted list of every physical input that drives two or more actions on that device, with all the actions it maps to. This is where a real clash would show up.
- **All bindings** — the full action-to-input list for that device.

Key names are cleaned up for reading (prefixes like `KEY_` are dropped, and multi-key combinations are joined with `+`).

## Finding a specific control

Use the **Search actions or keys…** box at the top of the panel. Typing filters both sections live — search by action name (for example, `handtool`) or by key (for example, `x`) to jump straight to what you care about.

## It's a view, not a verdict

The reused-input section is deliberately *not* called a conflict list. On a normal profile the same input legitimately drives many actions in non-overlapping contexts — a mouse axis feeds a dozen contextual controls; one button is a flashlight on foot and headlights in a vehicle. Silo surfaces the reuse and lets *you* judge whether any of it is actually a problem.

> Read-only and completely safe. The Bindings map only reads `inputBinding.xml` ; it never edits, rebinds, or writes anything back. Silo has no binding editor — to change a control, use the settings menu inside FS25. Nothing here can alter your game files, so there is nothing to undo.
