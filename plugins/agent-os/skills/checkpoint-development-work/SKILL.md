---
name: checkpoint-development-work
description: Form and persist a coherent, privacy-safe development checkpoint for an ephemeral or replaceable environment. Use when the user requests a checkpoint, before pausing or switching environments, before an external wait, before interruption-prone long-running work, or when dirty local work must become durable remote state. Do not trigger after every coherent phase.
---

# Checkpoint development work

Shrink work into a consistent, explainable state that another environment can
recover from. A checkpoint preserves evidence; it does not declare incomplete
work delivered and does not by itself pause, complete, or narrow the approved
task.

## Workflow

1. Read the workspace workflow's [workspace-security.md](../prepare-development-workspace/references/workspace-security.md) before any task, Git, provider, working-tree, or diff inspection. Establish the safe output boundary before local changes can enter model context.
2. Evaluate the checkpoint only when the user requests it or interruption, environment replacement, external waiting, or long-running work could lose material progress. Do not checkpoint merely because a coherent phase ended.
3. Inspect the working tree by names and status first, then the current branch, remote-branch evidence, any existing pull request or task record, completed phase, and relevant verification. Screen candidate paths for environment files, credentials, private metadata, generated output, and other sensitive content before reading patches. Prefer shrinking the slice over persisting unrelated or internally inconsistent changes.
4. Read [checkpoint-consistency.md](references/checkpoint-consistency.md) and classify the candidate as `reviewable`, `recoverable-only`, or `uncheckpointable`.
5. Read the delivery workflow's [authority-policy.md](../deliver-software-change/references/authority-policy.md) and [implementation-lifecycle.md](../deliver-software-change/references/implementation-lifecycle.md). Allocate durable state to its owner:
   - code and synchronized documentation to a scoped Git commit and remote branch;
   - shared implementation status and non-sensitive verification to an existing pull request or task record when one is already in use;
   - session-local recovery details to a private, untracked location.
6. For `reviewable` or `recoverable-only` work, run the narrowest relevant checks and inspect the exact diff only for paths that passed the safety screen. Commit and push when remote recovery materially reduces interruption risk or the repository workflow requires it; do not create an issue, pull request, or remote checkpoint solely to satisfy this Skill. Never silently mix unrelated work.
7. Create or update a draft pull request only when the user requests it or the repository workflow normally uses one, and only when the remote state is coherent enough to review. Describe failed or skipped verification explicitly; never label `recoverable-only` work delivered.
8. Read [checkpoint-record.md](references/checkpoint-record.md) and record the durable evidence and exact resume point. For an external wait, record the exact resume condition: the event or observed state that permits work to continue.
9. For `uncheckpointable` work, do not commit arbitrary dirty state. Report the unpersisted files, inconsistency, and smallest action that could form a safe checkpoint.
10. After a successful checkpoint, continue with the next safe, authorized, locally executable action. Do not return control merely because a coherent phase was persisted.

## Boundaries

- Do not rewrite Git history, auto-merge, create a new storage service, or treat chat as durable state.
- Do not publish secrets or private task metadata to GitHub.
- Do not fabricate a commit, verification result, remote branch, pull request, or recovery guarantee.
- Prefer a small, explicit checkpoint over a broad WIP snapshot.
- Commit, push, task commentary, phase completion, and a clean worktree are not stop conditions.
- Stop only when a material semantic delta requires authority; a concrete permission, capability, credential, dependency, or safety blocker prevents progress; an external wait is required; approved scope is documentation-only or complete; the user requested an explicit user pause; or a closer repository rule requires a repository-required manual gate.
- Do not ask the user to say “continue” merely because a checkpoint succeeded.
- Do not merely announce that the next phase will run later when its next action is safe, authorized, and locally executable now.
- `recoverable-only` means incomplete but durable; never call it delivered or complete, and continue with other safe local work when available.

## Resume

Resume from the remote branch and any existing pull request first, verify the recorded commit
exists, then use the checkpoint record's next step. If the checkpoint names an
external wait, verify its exact resume condition before continuing. If no stop
condition applies, perform the next action rather than asking for another
continuation instruction. If remote state conflicts with a checkpoint record,
trust remote Git and correct the record.
