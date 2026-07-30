---
name: checkpoint-development-work
description: Form and persist a coherent, privacy-safe development checkpoint for an ephemeral or replaceable environment. Use after a coherent phase, before pausing or switching environments, before an external wait, before long-running work, or when Codex must report whether dirty local work can safely become durable remote state.
---

# Checkpoint development work

Shrink work into a consistent, explainable state that another environment can
recover from. A checkpoint preserves evidence; it does not declare incomplete
work delivered and does not by itself pause, complete, or narrow the approved
task.

## Workflow

1. Read the workspace workflow's [workspace-security.md](../prepare-development-workspace/references/workspace-security.md) before any task, Git, provider, working-tree, or diff inspection. Establish the safe output boundary before local changes can enter model context.
2. Evaluate the checkpoint after a coherent phase, before pausing or switching environments, before an external wait, and before long-running work whose interruption would lose material progress. Do not checkpoint on every edit.
3. Inspect the working tree by names and status first, then the current branch, owning issue or user-approved set of combined issues, sanitized remote-branch evidence, pull request, completed phase, and relevant verification. Screen candidate paths for environment files, credentials, private metadata, generated output, and other sensitive content before reading patches. Prefer shrinking the slice over persisting unrelated or internally inconsistent changes.
4. Read [checkpoint-consistency.md](references/checkpoint-consistency.md) and classify the candidate as `reviewable`, `recoverable-only`, or `uncheckpointable`.
5. Read the delivery workflow's [github-privacy.md](../execute-linear-issue/references/github-privacy.md) and [implementation-lifecycle.md](../execute-linear-issue/references/implementation-lifecycle.md). Allocate durable state to its owner:
   - code and synchronized documentation to a scoped Git commit and remote branch;
   - public implementation status and non-sensitive verification to the owning GitHub issue or explicitly scoped cumulative pull request;
   - private decisions, task status, and private blockers to the approved private task system.
6. For `reviewable` or `recoverable-only` work, run the narrowest relevant checks, inspect the exact diff only for paths that passed the safety screen, commit with a scope-first subject, and push the approved branch. Never silently mix unrelated work; get user approval before combining multiple issues.
7. Create or update a draft pull request only when the remote state is coherent enough to review. Describe failed or skipped verification explicitly; never label `recoverable-only` work delivered.
8. Read [checkpoint-record.md](references/checkpoint-record.md) and record the durable evidence and exact resume point. For an external wait, record the exact resume condition: the event or observed state that permits work to continue.
9. For `uncheckpointable` work, do not commit arbitrary dirty state. Report the unpersisted files, inconsistency, and smallest action that could form a safe checkpoint.
10. After a successful checkpoint, continue with the next safe, authorized, locally executable action. A documentation-baseline checkpoint continues directly into Red when executable implementation remains in scope. Do not return control merely because a coherent phase was persisted.

## Boundaries

- Do not rewrite Git history, auto-merge, create a new storage service, or treat chat as durable state.
- Do not publish secrets or private task metadata to GitHub.
- Do not fabricate a commit, verification result, remote branch, pull request, or recovery guarantee.
- Prefer a small, explicit checkpoint over a broad WIP snapshot.
- Commit, push, issue comment, phase completion, and a clean worktree are not stop conditions.
- Stop only when a material semantic delta requires authority; a concrete permission, capability, credential, dependency, or safety blocker prevents progress; an external wait is required; approved scope is documentation-only or complete; the user requested an explicit user pause; or a closer repository rule requires a repository-required manual gate.
- Do not ask the user to say “continue” merely because a checkpoint succeeded.
- Do not merely announce that the next phase will run later when its next action is safe, authorized, and locally executable now.
- `recoverable-only` means incomplete but durable; never call it delivered or complete, and continue with other safe local work when available.

## Resume

Resume from the remote branch and pull request first, verify the recorded commit
exists, then use the checkpoint record's next step. If the checkpoint names an
external wait, verify its exact resume condition before continuing. If no stop
condition applies, perform the next action rather than asking for another
continuation instruction. If remote state conflicts with a checkpoint record,
trust remote Git and correct the record.
