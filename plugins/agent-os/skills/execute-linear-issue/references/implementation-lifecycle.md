# GitHub implementation lifecycle

## Naming

Use the repository's local convention when it is more specific. For non-trivial work, require a GitHub issue before using the default convention:

- Feature branch: `feat/issue-<github-number>-<technical-slug>`
- Fix branch: `fix/issue-<github-number>-<technical-slug>`
- Commit: `<scope>: <imperative summary>`
- Pull request: `<scope>: <imperative delivery summary>`

The number in a branch is a GitHub issue number. Never substitute a private Linear identifier.

If a repository explicitly forbids GitHub issues, use its documented replacement branch convention. Stop for clarification when no replacement exists.

## Phases

1. **Orient:** Read applicable instructions, contracts, current code, tests, fixtures, and smoke paths.
2. **Define:** Align the GitHub issue with the approved private scope without copying private metadata.
3. **Branch:** Create one branch for the GitHub issue. Keep all slices for that issue on the same branch.
4. **Red:** Add the smallest failing test or deterministic check that proves the gap.
5. **Green:** Implement the smallest behavior that passes.
6. **Refactor:** Remove duplication and apply the evidence-based abstraction guidance in `engineering-quality.md`.
7. **Verify:** Run relevant tests, exercise the path, inspect the diff, and run Codex review.
8. **Persist:** Commit, push, and create or update the pull request.
9. **Merge:** Wait for explicit authority and required checks. Do not equate a staging deploy with production exposure.
10. **Record:** After merge, update only the private Linear task with the completion checkpoint.

One issue per branch is the default. A cumulative branch may include multiple public issues only when the user or repository authorized that scope before the work was combined. Record the authorized public scope in the pull request so recovery is unambiguous; the pull request cannot grant or retroactively invent its own exception.

## Pull request content

Include the shipped behavior, verification, risk, documentation impact, rollout or exposure plan when applicable, and rollback path. Use `Closes #<github-number>` for the owning GitHub issue when merge should close it. Do not mention the originating Linear task.
