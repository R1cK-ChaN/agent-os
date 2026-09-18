# Implementation lifecycle

Use the smallest path that delivers the requested outcome safely.

## Ordinary changes

1. **Orient:** Read applicable instructions, code, tests, contracts, and current working-tree state.
2. **Implement:** Add a meaningful failing check when practical, make the smallest change, and refactor only where useful.
3. **Verify:** Run targeted checks and exercise the affected path.
4. **Synchronize:** Update durable documentation only when system meaning changed.
5. **Deliver:** Inspect the diff, then commit, push, or open a pull request when requested or normally required for the outcome.

Ordinary changes do not require an issue, a special branch, a documentation baseline, a separate documentation commit, or automated Codex review.

## Major changes

1. **Orient:** Establish terminology, ownership, invariants, compatibility, release constraints, and affected boundaries.
2. **Design and document:** Record changed requirements, interfaces, responsibilities, data ownership, migration rules, or durable trade-offs before executable implementation when the repository has an owning document. Resolve material semantic gaps before code.
3. **Implement in slices:** Use meaningful Red-Green-Refactor checks where practical.
4. **Verify by risk:** Add integration, migration, concurrency, authorization, staging, or full-suite evidence only for the risks the change introduces.
5. **Deliver and release:** Use the repository's normal Git and release workflow, preserving explicit authority for merge, production exposure, destructive operations, and external communication.

The documentation-first step may be a separate commit when it creates a useful shared design or recovery checkpoint. It does not depend on a GitHub issue and is not required to be the first unique commit on every branch.

## Naming

Follow repository conventions. When none exists:

- Title a GitHub issue as `<scope>: <concise behavior change>`. Do not repeat the repository name as a bracketed prefix unless it adds information outside that repository.
- When an isolated branch is useful, use `feat/<technical-slug>` or `fix/<technical-slug>`.
- Use `<scope>: <imperative summary>` for commit messages and pull-request titles.

If an existing issue owns the work, link it normally. Do not create an issue only to obtain a branch number or closing keyword.
