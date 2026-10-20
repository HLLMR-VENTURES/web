// URL contract for live.hllmr.com: the shared family runner (family-contract.mjs) over live.urls.json.
// Run with `npm run test:live`, or CONTRACT_BASE_URL=... via run-nginx-family.sh live.
import { runFamilyContract } from "./family-contract.mjs";

runFamilyContract("live");
