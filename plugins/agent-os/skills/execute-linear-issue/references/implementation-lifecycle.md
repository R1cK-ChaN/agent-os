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
2. **Define:** Align the GitHub issue with the approved private scope without copying private metadata. When the target has a project handbook, identify the normative inputs, intended implementation outputs or boundaries, and verification evidence for the slice according to its handbook contract.
3. **Branch:** Create one branch for the GitHub issue. Keep all slices for that issue on the same branch.
4. **Documentation baseline:** Follow the project-handbook compilation contract or the repository's equivalent. Compile approved intent and applicable rationale into the owning project documents and update the current handoff. Issue approval authorizes validation, commit, push, and checkpoint of a semantically equivalent prose-only baseline without a second full-document review. Stop before commit only for a material semantic delta, ask one focused question, update the issue and owning normative source when intent changes, then persist automatically after resolution. Commit the baseline as the first commit unique to the issue branch and record it on the GitHub issue. Do not begin Red before this durable checkpoint, and do not defer unresolved protocol or architecture choices to TDD.
5. **Red:** Add the smallest failing test or deterministic check that proves the implementation gap.
6. **Green:** Implement the smallest behavior that passes.
7. **Refactor:** Remove duplication and apply the evidence-based abstraction guidance in `engineering-quality.md`.
8. **Verify:** Run relevant tests, exercise the path, inspect the diff, and run Codex review.
9. **Persist:** Commit, push, and create or update the pull request.
10. **Merge:** Wait for explicit authority and required checks. Do not equate a staging deploy with production exposure.
11. **Record:** After merge, update only the private Linear task with the completion checkpoint.

Default to one GitHub issue per branch. Get user approval before combining multiple issues on one branch.

## Pull request content

Include the shipped behavior, normative inputs, implementation outputs or affected boundaries, verification evidence, risk, documentation impact, rollout or exposure plan when applicable, and rollback path. Use `Closes #<github-number>` for the owning GitHub issue when merge should close it. Do not mention the originating Linear task.
