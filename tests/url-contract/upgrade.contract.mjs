// URL contract for upgrade.hllmr.com: the shared family runner (family-contract.mjs) over upgrade.urls.json.
// Run with `npm run test:upgrade`, or CONTRACT_BASE_URL=... via run-nginx-family.sh upgrade.
import { runFamilyContract } from "./family-contract.mjs";

runFamilyContract("upgrade");
