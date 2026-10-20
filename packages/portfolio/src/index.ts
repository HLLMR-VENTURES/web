/**
 * The HLLMR portfolio record (ADR-0015 D6): every venture, project and piece of writing, read by
 * each site that shows them. URLs here are absolute; a site turns links to its own host back into
 * paths with `local()`.
 */
export * from "./projects.ts";
export * from "./writing.ts";
export * from "./urls.ts";
