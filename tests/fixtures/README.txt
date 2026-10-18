Fixture data for local development and CI. Shapes follow the SiloAPI authors plan
(GET /authors/:login, GET /author/me) and the live GET /stats. Not shipped in any artifact.
Serve with `npm run fixtures` (http://127.0.0.1:8787), then build or run dev with
PUBLIC_SILO_API=http://127.0.0.1:8787.
