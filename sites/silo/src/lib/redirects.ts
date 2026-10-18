/** Typed access to sites/silo/redirects.json (the single source for the redirect layer). */
import data from "../../redirects.json";

export interface RedirectMap {
  go: Record<string, string>;
  vanity: Record<string, string>;
  permanent: Record<string, string>;
}

export const redirects: RedirectMap = {
  go: data.go,
  vanity: data.vanity,
  permanent: data.permanent,
};

/** Keys must stay URL-safe and stable: lowercase letters, digits and hyphens. */
export const GO_KEY = /^[a-z0-9][a-z0-9-]{0,63}$/;
