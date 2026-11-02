---
title: "Conflicts between active mods"
label: "Conflicts"
summary: "Diagnose, Conflicts shows which of your active mods clash with each other, how much it matters, and lets you park one of them."
group: "When something breaks"
order: 14
legacyAnchor: "conflicts-h"
appliesTo: "1.0"
---
Some mods can't work side by side. Two of them may claim the same slot, or one may quietly replace another's settings, and you often don't find out until the game misbehaves. Silo reads the `modDesc.xml` of every **active** mod and flags these clashes before you play. It checks again by itself whenever you change which mods are active, so there is nothing to rescan.

## Opening it

Click **Diagnose** in the left rail (or press Alt+4) and choose the **Conflicts** tab. The number on the tab, and the header status chip, count only the clashes that are a Problem or worth a Review. You can also start from a mod: its details show a **Conflicts with N active mods** banner with **See conflicts**, its row in the Library carries a **Conflict** badge, and the **In conflict** option under **Filters** narrows the Library to the mods involved.

![Diagnose, Conflicts, showing one Problem: two mods claim the same exclusive slot, with Park one…](../../assets/screens/conflicts.png)

## Problem, Review and Note

The headline reads like *1 problem · 0 to review*. Each clash has one of three labels:

- **Problem**: the game will load only one of these mods' versions of something, so at least one of them won't work as intended. Fix these.
- **Review**: something that can go wrong depending on load order. Worth a look.
- **Note**: for your information only. Notes are hidden until you turn on **Show notes**.

## What Silo checks

Each row has a plain title:

- **Two mods claim the same exclusive slot**: the game loads only one mod per slot (shown as **Exclusive slot** in a mod's details). A Problem.
- **Two mods add the same feature name**, and the same check for a vehicle type, building type, hand tool type, control action, brand or shop category: only one of them takes effect. A Problem.
- **Two mods define the same fill type**: whichever loads last replaces the others' settings, such as capacity and price. A Review.
- **Two mods ship a script with the same file name**, such as `main.lua`: a Note. The game keeps each mod's scripts apart, so the shared name alone doesn't make them clash.
- **More than one map is active**: a Note, not a conflict. Only the map your savegame uses loads, and the others wait until you start a save on them.
- **Ground-pile slots** and **material types**: whether your active mods fit within the game's limits. See below.

Two maps never clash with each other, because only one of them loads. A map can still clash with a mod that isn't a map, and then the explanation says it matters only when you play on that map.

## Ground-pile slots and material types

Some mods don't clash with any one other mod but together ask for more than the game has room for. The Straw Harvest and Pumps n' Hoses DLCs are the usual victims: they turn themselves off and close your save. Silo counts both limits before you play, using the base game, your installed DLCs and your active mods, including materials a mod adds from a script.

- **Ground-pile slots** are the materials that can lie on the ground as piles. The base maps have 63. The base game already uses 48 to 51 of them, depending on the map, and the DLCs up to 5 more.
- **Material types** are crops, feed, fertilizers, products and the like. The game supports 255. The base game uses 178 to 182 of them, and all the DLCs together bring that to about 230. Mods load after the DLCs, so when the game runs out, it's your mods' materials that go missing.

How sure Silo is decides the label:

- **More ground-pile types than the map has room for** or **More material types than the game supports**: a Problem. Your mods certainly go over.
- **Possibly more ground-pile types than the map has room for** or **Possibly more material types than the game supports**: a Review. They may go over, depending on things Silo can't read for certain.
- **Ground-pile slots are nearly full** (3 or fewer left) or **Material types are nearly full** (5 or fewer left): a Note.

The explanation gives the counts and names the mods using the most. Turn a few of those off. Each map is judged on its own, and a list a mod ships for one particular map counts only when that map is active. If the game has already run out, [Last run](/help/crash-triage/) says so after you play.

When every mod in a clash has the same author, it's most likely deliberate, so Silo lowers it one step (a Problem becomes a Review, a Review becomes a Note) and says so in the explanation.

## Fixing a clash

1. Read the explanation and decide which mod to keep. Click a mod's name to open its details in the Library.
2. Click **Park one…** and choose the mod to park.
3. Silo parks it and shows a toast with **Undo**. The conflict list updates on its own.

Parking never deletes a mod. It stays in your library, and you can switch it back on any time. While another change to your library is running, **Park one…** is off and says why. For two mods by different authors that you want to keep together, the clash is worth reporting to their authors.
