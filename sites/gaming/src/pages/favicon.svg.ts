// /favicon.svg: the GAMING arms in banner form (@hllmr/brand faviconSvg).
import type { APIRoute } from "astro";
import { faviconSvg } from "@hllmr/brand/arms";

export const GET: APIRoute = () => new Response(faviconSvg("gaming"), { headers: { "Content-Type": "image/svg+xml" } });
