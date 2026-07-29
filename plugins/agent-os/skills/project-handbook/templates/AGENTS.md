# Project collaboration rules

This file is the repository's local working agreement for people and Agents.

1. Read `README.md`, `docs/INDEX.md`, `docs/NOW.md`, and the relevant ADRs before changing code.
2. When requirements are ambiguous, record assumptions and ask for a decision; do not guess silently.
3. For non-trivial work, create the approved issue and issue branch, then compile the approved intent into the affected handbook documents. Present the documentation baseline for user review and persist the approved documentation-only baseline as the first commit unique to the issue branch before executable implementation.
4. Red-Green-Refactor does not apply to the documentation-only baseline; run the narrowest deterministic document, reference, privacy, formatting, and repository checks instead.
5. Update code, tests, and affected handbook documents in the same branch and pull request. If accepted intent changes, update its owning normative document before the corresponding code.
6. Update `INTERFACES.md` when a cross-module or external contract changes.
7. Add an ADR when an applicable durable architectural decision needs to preserve why it was chosen, its alternatives, and its consequences. Keep `ARCHITECTURE.md` focused on resulting current structure.
8. Remove completed work from `NOW.md`; keep history in Git, issues, pull requests, and ADRs.
9. For non-trivial work, identify the normative inputs, implementation outputs or boundaries, and verification evidence.
10. When code, tests, requirements, or ADRs disagree, preserve the conflict, classify the owning defect, and resolve the intended behavior explicitly.
11. Do not put credentials, private task identifiers, private URLs, or production data in repository documents.
