# Manual acceptance checklist

Use this checklist before a plugin release or after changing a workflow boundary. Run it against a disposable repository or an already authorized real project. Do not use production credentials or data.

## Sidecar bootstrap

- Run `node scripts/test_bootstrap.mjs` and confirm it passes.
- Confirm bootstrap preserves clean and dirty target repositories exactly.
- Confirm Agent OS writes only managed Skill copies under the external user Skill root.
- Confirm symlink, linked-worktree, shared Git directory, and external hooks escapes are rejected without target mutation.
- Start a new task and confirm `prepare-development-workspace` independently verifies durable repository state.

## Workspace recovery

- Start in a fresh environment with a remote branch or pull request.
- Confirm workspace security loads before Git or provider inspection.
- Confirm each required capability is reported as available, unavailable, requires authorization, or unknown.
- Confirm raw remote credentials, secret values, and environment dumps are never printed.
- Confirm a missing handbook is not treated as a blocker and is not initialized automatically.

## Risk-scaled delivery

- For an ordinary bug or localized feature, confirm implementation proceeds without Linear, a GitHub issue, or a pre-implementation documentation baseline.
- Confirm ordinary work uses the narrowest relevant test or deterministic check.
- For a major public API, schema, authorization, cross-service, or hard-to-reverse architecture change, confirm affected durable documents are updated before executable implementation.
- Confirm a major-change documentation checkpoint can be separate when shared review or recovery benefits, but is not required to be the first unique branch commit.
- Confirm unresolved material semantics cause one focused question before code, while faithful documentation of already approved intent does not require repeated approval.
- Confirm issues, branches, commits, pushes, pull requests, and release gates are created only when requested, required by repository workflow, or necessary for the delivery outcome.

## Issue-driven pair programming

- Discuss a requirement with `shape-delivery-issue` and confirm the issue is created only after the direction is settled and the user confirms the draft.
- Confirm the created issue passes the handoff check: verifiable acceptance criteria, explicit non-goals, recorded decisions with rationale, no references to the conversation, and a stated delivery endpoint.
- Hand the issue URL to a fresh session with no chat history and confirm it delivers the issue without asking for decisions the issue already records.
- Confirm the delivering session opens a draft pull request with `Closes #<number>` at the first push.
- Interrupt delivery, start another fresh session with the same issue, and confirm it resumes from the linked pull request instead of restarting.
- Confirm a contradiction between the issue and the code produces an issue comment and a stop, not a silent scope change.
- Confirm the pull request merges only after every required CI check passes, stops at the ready pull request when the repository has no CI, and returns to the default branch afterwards except inside a managed worktree.
- Install the plugin in both Codex and Claude Code from the shared local checkout and confirm both list the same Skills.

## Project handbook

- Run `node scripts/test_handbook.mjs` and confirm it passes.
- Run `init-handbook` against an empty disposable Git repository and confirm it creates starter documents without `docs/NOW.md`.
- Run it again and confirm it does not overwrite existing files.
- Run with `--check-only` and confirm no target mutation.
- Confirm equivalent lowercase or repository-specific documents prevent duplicate canonical files.
- Confirm initialized documents distinguish normative intent, boundary contracts, and implementation evidence.
- Confirm ordinary changes are not forced through a documentation baseline and major-change criteria are explicit.

## Checkpoint and resume

- Create a coherent non-sensitive change and a separate inconsistent or sensitive candidate.
- Confirm coherent work can become a remote checkpoint when interruption risk justifies it.
- Confirm inconsistent or sensitive work is not persisted as delivered.
- Confirm a checkpoint does not require creating an issue and does not pause safe authorized work.
- Resume from a fresh environment using the remote branch and pull request when present.

## Privacy, authority, and release

- Confirm credentials, private task metadata, private URLs, and production data stay out of repository output.
- Confirm normal staging validation does not add production rollout machinery.
- Confirm production deployment, production exposure, destructive actions, access-control changes, and external communication retain explicit authority boundaries.

## User interface

- Give `design-user-interface` a repository with a theme, tokens, and shared components, and ask for a new screen.
- Confirm it uses existing tokens and components, with no hard-coded colors, unstyled native controls, or local copies of shared components.
- Confirm it runs the repository's style or token lint when one exists, and renders the result in light, dark, and mobile widths when the environment allows.
- Confirm the output avoids the patterns in `ui-tells.md` unless the repository's design calls for them.
- In a repository without a design system, confirm it proposes a minimal token set before building.

## Design precedence

- Give `design-software-change` a repository with explicit naming, schema, API, or verification conventions.
- Confirm repository rules override plugin defaults and project facts remain in the repository.
- Confirm the design avoids pass-through abstractions that hide no meaningful complexity.
