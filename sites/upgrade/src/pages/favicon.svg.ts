// /favicon.svg: the UPGRADE arms in banner form (@hllmr/brand faviconSvg).
import type { APIRoute } from "astro";
import { faviconSvg } from "@hllmr/brand/arms";

export const GET: APIRoute = () => new Response(faviconSvg("upgrade"), { headers: { "Content-Type": "image/svg+xml" } });
