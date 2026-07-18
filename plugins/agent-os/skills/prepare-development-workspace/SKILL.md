---
name: prepare-development-workspace
description: Assess and recover a repository-backed development workspace in a fresh, ephemeral, replaced, or resumed Codex environment. Use after Agent OS Skill activation or before implementation when Codex must identify durable remote work state, repository instructions, required capabilities, or authorization blockers without modifying the target project's working tree or Git internals.
---

# Prepare a development workspace

Produce a bounded, evidence-based Workspace Readiness result. Agent OS is an external Sidecar; the target repository owns project truth and remains read-only during bootstrap and recovery.

## Workflow

1. Read `references/workspace-security.md` before inspecting task, Git, provider, repository, log, fixture, credential, cloud-tool, or external-service data.
2. Read `references/sidecar-bootstrap.md` when Agent OS was activated from a cloned public repository. Treat successful activation only as evidence that Skills were copied outside the target project, not as proof of project readiness.
3. Resolve the durable recovery chain from the user's target repository and optional task identifier: repository, default branch, linked pull request, remote branch, and latest durable commit. Prefer remote Git and pull-request state over stale local state or chat history.
4. Read the root and applicable nested `AGENTS.md` files, runtime declarations, lockfiles, specifications, scripts, tests, CI workflows, and smoke documentation without writing setup files, hooks, configuration, caches, or reports into the target repository. When the target has a project handbook, follow `README.md` → `docs/INDEX.md` → `docs/NOW.md` and then load only task-relevant requirements, interfaces, architecture sections, and ADRs. If it is absent, report that it is not initialized and name the explicit `init-handbook` entry point without creating it automatically.
5. Read `references/capability-discovery.md`, then probe only capabilities needed for the next approved slice. Classify each as `available`, `unavailable`, `requires authorization`, or `unknown` using non-sensitive evidence.
6. Check secret and service prerequisites by reference or presence only. Never read or print values, dump the environment, copy production credentials, or infer authorization.
7. Read `references/workspace-readiness.md` and return one concise result with recovery state, capabilities, evidence, blockers, and next entry point.
8. Stop at the readiness boundary. Ask for authorization only when the next required action needs it.

## Boundaries

- Bootstrap and recovery are read-only for the target worktree, Git internals, repository-local configuration, and hooks.
- Do not create `.agents`, `.codex`, Agent OS locks, handoffs, reports, submodules, ignore rules, or temporary files inside the target repository.
- Do not switch branches, stash, install dependencies, run formatters, create a devcontainer, start costly services, or restructure the project during readiness assessment.
- Let repository commands, versions, and conventions override Plugin defaults.
- Report partial readiness honestly. Missing evidence is `unknown`, not success.

## Stop conditions

Stop with a concrete blocker when the repository or recovery entry point is ambiguous, a required capability is unavailable, authorization is required, or a safe probe cannot establish the next fact.
