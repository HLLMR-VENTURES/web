# Agent instructions for HLLMR/web

This repository holds the HLLMR static sites: hllmr.com (`sites/hllmr`), dhellmer.com (`sites/dhellmer`) and silo.hllmr.com (`sites/silo`), plus the shared `packages/design`. The governing instructions are [hllmr-infra's AGENTS.md](https://github.com/HLLMR/hllmr-infra/blob/main/AGENTS.md): roles, asking before anything destructive, verifying recovery paths, reporting, and release approvals. This file adds only what is specific to this repository.

## Worktrees

From hllmr-infra AGENTS.md, verbatim (hllmr-infra#89, 2026-10-20):

> Worktrees live under one root, `F:\Worktrees\<repo>\<topic>` (estate hygiene game plan D3, 2026-10-20), never inside or beside a canonical checkout. Remove your own worktree with `git worktree remove` once its PR merges or closes; a dirty worktree is a stop-and-ask. This applies to every repo an agent works in.

For this repository the root is `F:\Worktrees\web\<topic>`. Older worktrees under `F:\Projects\hllmr-web-wt\` stay until their current work finishes; start new ones under the new root.

## Who works where

Each site has its own domain agent: Claude (web dev) for `sites/hllmr`, the dhellmer.com site agent for `sites/dhellmer`, and Claude (Silo site) for `sites/silo`. Work in your own site's paths. A change to `packages/design`, `package-lock.json`, the shared scripts or another site's paths is coordinated with the agents it affects first.

## Merging

- A site agent merges its own PRs, and only on the owner's approval of that PR's exact head commit. Quote the approval in the PR, then squash-merge with `gh pr merge --squash --match-head-commit <sha>`. No force-pushes.
- `main` requires branches to be up to date. Updating a branch changes its head, so ask the owner to approve the new head, unless their approval explicitly covers "its head once brought up to date with main if otherwise identical" for that PR.
- Before merging anything that fires another site's release workflow, tell Claude (infra), and list the workflows the merge fires in the PR body.

## What fires which release

Re-read the `on:` blocks in `.github/workflows/release-*.yml` before relying on this; it was copied from main on 2026-10-20.

| Workflow | Fires on pushes to `main` touching |
|---|---|
| `release-hllmr` | `sites/hllmr/**`, `packages/design/**` except `**/*silo*.css`, `deploy/hllmr/**`, `tests/url-contract/hllmr*`, `package-lock.json` |
| `release-dhellmer` | `sites/dhellmer/**`, `sites/hllmr/src/lib/projects.ts`, `sites/hllmr/src/lib/writing.ts`, `packages/design/**` except `**/*silo*.css`, `deploy/dhellmer/**`, `tests/url-contract/dhellmer*`, `package-lock.json` |
| `release-silo` | `sites/silo/**`, `packages/design/**`, `deploy/silo/**`, `tests/url-contract/silo*`, `tests/url-contract/contract.test.mjs`, `tests/url-contract/nginx-model.mjs`, `tests/url-contract/run-nginx.sh`, `package-lock.json` |

Coming change: ADR-0015 ([hllmr-infra#85](https://github.com/HLLMR/hllmr-infra/pull/85), not yet merged) adds a shared `packages/portfolio` and four division sites (tools, upgrade, live, gaming). When those land, the workflows and this table change with them.

Silo-only design files must be named `*silo*.css`. Otherwise they republish hllmr.com and dhellmer.com, whose footer revision follows `packages/design`.

A published release is not live. Installing it on the host needs the owner's line naming that release (or a standing grant for that site), carried out by Claude (infra).
