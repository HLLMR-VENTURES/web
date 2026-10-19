/** Help topics in reading order, grouped as the old single-page help's sidebar was. */
import { getCollection, type CollectionEntry } from "astro:content";

export type Topic = CollectionEntry<"help">;

/** @returns every topic, in order */
export async function topics(): Promise<Topic[]> {
  return (await getCollection("help")).sort((a, b) => a.data.order - b.data.order);
}

/** @returns topics grouped by `group`, groups in the order of their first topic */
export async function groups(): Promise<{ name: string; topics: Topic[] }[]> {
  const out: { name: string; topics: Topic[] }[] = [];
  for (const t of await topics()) {
    const g = out.find((x) => x.name === t.data.group);
    if (g) g.topics.push(t);
    else out.push({ name: t.data.group, topics: [t] });
  }
  return out;
}

/** The hub's "What's going wrong tonight?" grid: a plain-words problem and the topic that answers it. */
export const PROBLEMS: { text: string; topic: string }[] = [
  { text: "The game crashed or won't load", topic: "crash-triage" },
  { text: "The log doesn't name a mod", topic: "guided-bisection" },
  { text: "Two mods fight over the same thing", topic: "conflicts" },
  { text: "Equipment won't take a map's filltype", topic: "filltype-bridge" },
  { text: "I don't know what's out of date", topic: "updates" },
  { text: "I can't match a friend's server", topic: "multiplayer" },
  { text: "The game doesn't see my mods", topic: "mods-folder" },
  { text: "My mods folder is a mess", topic: "library" },
];
