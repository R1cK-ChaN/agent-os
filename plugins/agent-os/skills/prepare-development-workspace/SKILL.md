---
name: prepare-development-workspace
description: Assess and recover a repository-backed development workspace in a fresh, ephemeral, replaced, or resumed Codex environment. Use before implementation when Codex must identify durable remote work state, repository instructions, runtimes, package managers, verification commands, tools, services, or authorization blockers without bootstrapping a universal environment or exposing secrets.
---

# Prepare a development workspace

Produce a bounded, evidence-based Workspace Readiness result. Discover the target repository's own development contract; do not replace it with plugin defaults.

## Workflow

1. Resolve the durable recovery chain: task or explicit request, repository, default branch, linked pull request, remote branch, and latest durable commit. Prefer remote Git and pull-request state over stale local state or chat history.
2. Read [workspace-security.md](references/workspace-security.md) before reading repository artifacts or inspecting secret references, logs, fixtures, credentials, cloud tools, or external services.
3. Read the root and applicable nested `AGENTS.md` files, file contract headers, runtime and package-manager declarations, lockfiles, specifications, scripts, tests, fixtures, CI workflows, and smoke documentation under that safety boundary.
4. Read [capability-discovery.md](references/capability-discovery.md), then probe only the capabilities needed for the next approved slice. Prefer read-only, low-cost checks and repository-provided commands.
5. Classify each required capability as available, unavailable, requires authorization, or unknown. Cite concrete evidence; never infer success from a file name, tool description, or previous environment.
6. Check secret and service prerequisites by reference or presence only. Never read or print secret values, dump the environment, copy production credentials, or claim authorization that was not observed.
7. Read [workspace-readiness.md](references/workspace-readiness.md) and return one concise Workspace Readiness result with the recovery entry point, evidence, blockers, and next safe action.
8. Stop at the readiness boundary. Ask for authorization only when the next required action needs it.

## Boundaries

- Let repository commands, versions, and conventions override plugin defaults.
- Do not automatically install large dependencies, create a devcontainer, start costly services, access production data, restructure the project, or add release machinery.
- Do not persist the readiness report as a new source of truth. Durable code state belongs in Git and task state belongs in its approved tracker.
- Report partial readiness honestly. Missing or ambiguous evidence is `unknown`, not success.

## Stop conditions

Stop with a concrete blocker when the repository or recovery entry point is ambiguous, a required capability is unavailable, authorization is required, or a safe probe cannot distinguish availability without exposing sensitive state.
