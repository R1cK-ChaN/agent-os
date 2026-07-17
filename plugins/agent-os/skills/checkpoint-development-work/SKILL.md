---
name: checkpoint-development-work
description: Form and persist a coherent, privacy-safe development checkpoint for an ephemeral or replaceable environment. Use after a coherent phase, before pausing or switching environments, before an external wait, before long-running work, or when Codex must report whether dirty local work can safely become durable remote state.
---

# Checkpoint development work

Shrink work into a consistent, explainable state that another environment can recover from. A checkpoint preserves evidence; it does not declare incomplete work delivered.

## Workflow

1. Evaluate the checkpoint after a coherent phase, before pausing or switching environments, before an external wait, and before long-running work whose interruption would lose material progress. Do not checkpoint on every edit.
2. Inspect the working tree, current branch, owning issue or explicitly approved set of consolidated issues, remote branch, pull request, completed phase, and relevant verification. Prefer shrinking the slice over persisting unrelated or internally inconsistent changes.
3. Read [checkpoint-consistency.md](references/checkpoint-consistency.md) and classify the candidate as `reviewable`, `recoverable-only`, or `uncheckpointable`.
4. Read the delivery workflow's [github-privacy.md](../execute-linear-issue/references/github-privacy.md) and [implementation-lifecycle.md](../execute-linear-issue/references/implementation-lifecycle.md). Allocate durable state to its owner:
   - code and synchronized documentation to a scoped Git commit and remote branch;
   - public implementation status and non-sensitive verification to the owning GitHub issue or explicitly scoped cumulative pull request;
   - private decisions, task status, and private blockers to the approved private task system.
5. For `reviewable` or `recoverable-only` work, run the narrowest relevant checks, inspect the exact diff, commit with a scope-first subject, and push the approved branch. Never silently mix unrelated work; a cumulative branch is valid only when its multi-issue scope is explicit and durable.
6. Create or update a draft pull request only when the remote state is coherent enough to review. Describe failed or skipped verification explicitly; never label `recoverable-only` work delivered.
7. Read [checkpoint-record.md](references/checkpoint-record.md) and record the durable evidence and exact resume point.
8. For `uncheckpointable` work, do not commit arbitrary dirty state. Report the unpersisted files, inconsistency, and smallest action that could form a safe checkpoint.

## Boundaries

- Do not rewrite Git history, auto-merge, create a new storage service, or treat chat as durable state.
- Do not publish secrets or private task metadata to GitHub.
- Do not fabricate a commit, verification result, remote branch, pull request, or recovery guarantee.
- Prefer a small, explicit checkpoint over a broad WIP snapshot.

## Resume

Resume from the remote branch and pull request first, verify the recorded commit exists, then use the checkpoint record's next step. If remote state conflicts with a checkpoint record, trust remote Git and correct the record.
