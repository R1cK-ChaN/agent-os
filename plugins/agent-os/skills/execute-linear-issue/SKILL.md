---
name: execute-linear-issue
description: Deliver a software change whose private task entry point is a Linear issue, using GitHub for repository work while preventing private Linear task metadata from appearing on GitHub. Use when the user asks to implement, resume, or complete a Linear issue and expects repository orientation, issue-scoped branching, TDD-aware implementation, verification, review, pull-request delivery, and post-merge completion evidence written back to Linear.
---

# Execute a Linear issue

Treat Linear as the private task ledger and GitHub as the implementation surface. Keep the relationship one-way: Linear may link to GitHub, but GitHub must not expose private Linear task metadata.

## Preconditions

Require an authorized Linear tool, GitHub access through `gh`, and a writable checkout. Report a missing dependency instead of inventing issue, repository, branch, test, or merge state.

Read the complete Linear issue before changing external state. Treat its approved scope and acceptance criteria as the task boundary.

## Workflow

1. Retrieve the Linear issue, relations, attachments, comments, status, project, and team.
2. Resolve the target GitHub repository from an explicit issue link, project resource, existing pull request, or durable project mapping. If ambiguous, ask once and save the confirmed repository link back to Linear.
3. Read the repository root and applicable nested `AGENTS.md` files, file contracts, specifications, tests, fixtures, scripts, and smoke paths.
4. Read [github-privacy.md](references/github-privacy.md) before creating or editing any GitHub artifact.
5. Require one GitHub issue for non-trivial implementation unless the target repository explicitly forbids GitHub issues and defines its own branch convention. Reuse a linked GitHub issue when present. Otherwise draft it without private Linear metadata, obtain required approval, create it, and attach its URL only on the Linear side. If issues are forbidden and no alternative branch convention exists, stop and ask instead of inventing one.
6. Read [implementation-lifecycle.md](references/implementation-lifecycle.md), then create one issue-scoped branch and implement one small Red-Green-Refactor-Verify slice.
7. Run repository verification and Codex review. Fix only material correctness, invariant, security, data-loss, and concrete edge-case findings. Run no more than two review rounds before a commit.
8. Commit with a scope-first imperative subject, push the branch, and create a pull request whose title summarizes the delivered behavior. Link only the applicable GitHub issue from the pull request.
9. Read [authority-policy.md](references/authority-policy.md) before merge, deployment, production exposure, destructive actions, or external communication. Never infer merge or production authorization.
10. Observe the merged pull request before marking the Linear issue complete. Then read [completion-checkpoint.md](references/completion-checkpoint.md), attach the merged pull request on Linear, record delivery evidence, and move the task to its completed state.

## Resume interrupted work

Reconstruct state from durable systems in this order:

1. Current Linear issue and its GitHub links
2. Linked pull request and checks
3. Remote branch and latest commit
4. Repository instructions and specifications
5. Linear comments and checkpoint evidence

Do not rely on a previous chat, local uncommitted changes, an old sandbox, or model memory as the source of truth. If remote state conflicts with a checkpoint, trust the remote repository and correct the Linear record.

## Stop conditions

Stop and report a concrete blocker when the repository cannot be resolved, required authorization is missing, acceptance criteria conflict, production safety is undefined, verification cannot run, or durable work cannot be pushed safely.

Do not mark the task complete until the pull request is merged and the completion checkpoint is written successfully.
