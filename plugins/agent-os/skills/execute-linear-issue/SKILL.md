---
name: execute-linear-issue
description: Deliver a software change whose private task entry point is a Linear issue, using GitHub for repository work while preventing private Linear task metadata from appearing on GitHub. Use when the user asks to implement, resume, or complete a Linear issue and expects repository orientation, issue-scoped branching, TDD-aware implementation, verification, review, pull-request delivery, and post-merge completion evidence written back to Linear.
---

# Execute a Linear issue

Treat Linear as the private task ledger and GitHub as the implementation surface. Keep the relationship one-way: Linear may link to GitHub, but GitHub must not expose private Linear task metadata.

## Security first

Read [workspace-security.md](../prepare-development-workspace/references/workspace-security.md) before checking Linear tool authorization or reading task, provider, Git, repository, attachment, comment, log, fixture, or external-service data. Establish the safe output boundary before any provider response can enter model context.

## Preconditions

Require an authorized Linear tool, GitHub access through `gh`, and a writable checkout. Report a missing dependency instead of inventing issue, repository, branch, test, or merge state.

Read the complete Linear issue before changing external state. Read [issue-contract.md](references/issue-contract.md) to classify the task and resolve authority between the private scope, target repository, and GitHub projection.

## Workflow

1. Retrieve the Linear issue, relations, attachments, comments, status, project, and team.
2. Resolve the target GitHub repository from an explicit issue link, project resource, existing pull request, or durable project mapping. If ambiguous, ask once and save the confirmed repository link back to Linear.
3. Use the plugin's `prepare-development-workspace` Skill to recover durable remote state and produce Workspace Readiness before implementation. Follow its recovery entry point, then read every applicable repository instruction, contract, specification, test, fixture, script, and smoke path it identifies.
4. Read [github-privacy.md](references/github-privacy.md) before creating or editing any GitHub artifact.
5. For non-trivial implementation, require one privacy-safe GitHub issue unless the target repository explicitly forbids issues and defines its own branch convention. Follow the projection and approval rules in `issue-contract.md`, then attach the GitHub URL only on the Linear side.
6. Read [implementation-lifecycle.md](references/implementation-lifecycle.md) and [engineering-quality.md](references/engineering-quality.md), then define the next small slice.
7. Create one issue-scoped branch before persisting design or implementation changes.
8. Before implementation, use the plugin's `design-software-change` Skill when the slice changes domain language, invariants, responsibilities, module boundaries, public interfaces, persistent data, schemas, state transitions, integrations, or architecture. Keep project-specific facts in the target repository.
9. Load every applicable delivery policy: read [living-map.md](references/living-map.md) for behavior, interface, persistence, provider, module-responsibility, data-flow, or directory-shape changes; read [release-safety.md](references/release-safety.md) for deployment, production-user, release-control, environment-specific, or externally visible changes; read [database-change.md](references/database-change.md) for durable schema, persistence, public API, or multi-version configuration changes; re-check the already loaded workspace security boundary when the slice adds credentials, logs, fixtures, external services, or environment authority; and read [verification-strategy.md](references/verification-strategy.md) to choose the smallest sufficient evidence for the slice. Keep ordinary staging validation fast and enabled.
10. At a coherent phase boundary, before pausing or switching environments, before an external wait, or before long-running work, use the plugin's `checkpoint-development-work` Skill. Persist only coherent, privacy-safe state and distinguish reviewable work from recoverable-only work.
11. Implement one small slice.
12. Run repository verification and Codex review according to `engineering-quality.md`. Do not commit unresolved material findings merely because the review-round limit was reached.
13. Commit with a scope-first imperative subject, push the branch, update the GitHub issue, and create a pull request whose title summarizes the delivered behavior. Link only the applicable GitHub issue from the pull request.
14. Read [authority-policy.md](references/authority-policy.md) before merge, production deployment or exposure, destructive actions, or external communication. Never infer production exposure from staging success.
15. Observe the merged pull request before marking the Linear issue complete. For runtime-affecting changes in a repository with an established staging environment, follow `release-safety.md`. When staging deployment is pre-authorized by the repository workflow or explicitly approved, deploy the enabled path and run the smallest representative staging smoke. If it is not pre-authorized, request approval only when the repository or approved issue actually requires staging validation; otherwise record that it was skipped. Do not invent a new gate, production-scale rehearsal, or unrelated proof when the established smoke is sufficient.
16. Read [completion-checkpoint.md](references/completion-checkpoint.md), attach the merged pull request on Linear, record the merge plus any required staging evidence, and move the task to its completed state. Do not block completion on unrelated or optional staging proof.

## Resume interrupted work

Run `prepare-development-workspace` first and use its Workspace Readiness result to identify the safe recovery entry point. Then reconstruct state from durable systems in this order:

1. Current Linear issue and its GitHub links
2. Linked pull request and checks
3. Remote branch and latest commit
4. Repository instructions and specifications
5. Linear comments and checkpoint evidence

Do not rely on a previous chat, local uncommitted changes, an old sandbox, or model memory as the source of truth. If remote state conflicts with a checkpoint, trust the remote repository and correct the Linear record.

## Stop conditions

Stop and report a concrete blocker when the repository cannot be resolved, required authorization is missing, acceptance criteria conflict, production safety is undefined, verification cannot run, or durable work cannot be pushed safely.

Do not mark the task complete until the pull request is merged and the completion checkpoint is written successfully.
