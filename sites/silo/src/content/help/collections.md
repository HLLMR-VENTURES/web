---
title: "Collections"
label: "Collections"
summary: "A collection is a mod-set you share as a link."
group: "Your library"
order: 7
legacyAnchor: "collections-h"
appliesTo: "0.11"
---
A **collection** is a mod-set you share as a *link*. Where a loadout lives on your machine (or travels as a `.silo` file you hand over), a collection is published to the web so anyone can open it, preview exactly what's in it, and import it into their own library. It's the way to say "here's my co-op pack" or "the mods this server runs" and have someone reproduce it. Like loadouts, a collection stores the *list* of mods — never the mod files — so publishing one shares names and versions, not copyrighted archives.

Click **Collections** in the top bar to open the panel. Sharing publishes through your own GitHub account, so it needs GitHub connected with the right permission:

- A **private** (secret gist) collection needs **Enable collection sharing** in Settings → GitHub, which grants the `gist` permission.
- A **public** (repo) collection needs **Enable actions**, which grants `public_repo`.

The panel tells you which one is missing. Opening and importing someone else's link needs no GitHub account.

## Sharing a set as a link

Under **Share as a link**, publish your current active set as one of two kinds:

- **Private — secret gist**: an unlisted GitHub gist. It isn't listed or searchable, but it isn't password-protected either. Anyone who has the link can open it. Share it only with your group.
- **Public — forkable repo**: a public GitHub repository anyone can find, browse and fork. Good for a set you want to publish openly.

Give it a name, publish, and use **Copy link** to share the URL. A collection contains its name, your GitHub username, an optional description and the mod list (tech names, versions, sources and a hash of the build you have of each). Your published collections are listed under **Your collections**, each tagged *Secret* or *Public*, with links to the gist or repo page. **Delete** removes a secret gist from inside Silo; a public repo you delete on GitHub.

## Opening a shared link

Paste a collection URL into **Open a shared link**. Silo fetches it and shows a **preview** before anything happens: the collection's name, author, description and full mod list, sorted into what Silo can install, what you need to get yourself (ModHub mods), version differences, mods that aren't in the catalog, and what you already have. A **Heads-up** lists any conflicts with the mods you already have and any dependencies nobody provides.

**Import collection →** saves the whole set as a loadout and downloads the mods Silo can install directly (GitHub releases), checking each download against the build the sharer pinned when the collection includes one. ModHub mods are listed in the loadout so you can get them from ModHub. Downloaded mods land in your mods folder like any other new download, so the game loads them. The rest of your active set doesn't change until you apply the loadout from the Loadouts panel.

> Publishing shares the list only, never mod files. Importing adds new `.zip` files to your mods folder and saves a loadout. It never removes or replaces a mod you already have.
