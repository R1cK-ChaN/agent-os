---
name: prepare-development-workspace
description: Assess and recover a repository-backed development workspace in a fresh, ephemeral, replaced, or resumed Codex environment. Use before implementation when Codex must consume an Agent OS bootstrap handoff, identify durable remote work state, repository instructions, required capabilities, or authorization blockers without modifying the target project's working tree or Git internals.
---

# Prepare a development workspace

Produce a bounded, evidence-based Workspace Readiness result. Agent OS is an external Sidecar; the target repository owns project truth and remains read-only during bootstrap and recovery.

## Workflow

1. Read `references/workspace-security.md` before inspecting task, Git, provider, repository, log, fixture, credential, cloud-tool, or external-service data.
2. When a bootstrap handoff is supplied, read `references/sidecar-bootstrap.md`, verify `projectMutationCheck.passed`, and treat the handoff as an ephemeral locator rather than a source of truth. Never search the target repository for Agent OS state.
3. Resolve the durable recovery chain: task or explicit request, repository, default branch, linked pull request, remote branch, and latest durable commit. Prefer remote Git and pull-request state over the handoff, stale local state, or chat history.
4. Read the root and applicable nested `AGENTS.md` files, runtime declarations, lockfiles, specifications, scripts, tests, CI workflows, and smoke documentation without writing setup files, hooks, configuration, caches, or reports into the target repository.
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

Stop with a concrete blocker when the repository or recovery entry point is ambiguous, the handoff reports a failed mutation check, a required capability is unavailable, authorization is required, or a safe probe cannot establish the next fact.
