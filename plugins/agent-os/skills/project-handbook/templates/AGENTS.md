# Project collaboration rules

This file is the repository's local working agreement for people and Agents.

1. Read `README.md`, `docs/INDEX.md`, `docs/NOW.md`, and the relevant ADRs before changing code.
2. When requirements are ambiguous, record assumptions and ask for a decision; do not guess silently.
3. For non-trivial work, create the approved issue and issue branch, then compile the approved intent into the affected handbook documents. Issue approval authorizes automatic persistence of a semantically equivalent documentation-only baseline as the first commit unique to the issue branch; do not request a second full-document review.
4. Stop before baseline commit only for a material semantic delta that approved scope and repository evidence cannot resolve. Ask one focused question, update the issue and owning normative source when intent changes, then persist automatically after resolution. Do not defer unresolved protocol or architecture choices to TDD.
5. Red-Green-Refactor does not apply to the documentation-only baseline; run the narrowest deterministic document, reference, privacy, formatting, and repository checks instead.
6. The pushed documentation baseline is a recovery checkpoint, not a pause or completion condition. When implementation remains in scope and no concrete stop condition applies, continue directly into Red without asking the user to say “continue.”
7. Update code, tests, and affected handbook documents in the same branch and pull request. If accepted intent changes, update its owning normative document before the corresponding code.
8. Update `INTERFACES.md` when a cross-module or external contract changes.
9. Add an ADR when an applicable durable architectural decision needs to preserve why it was chosen, its alternatives, and its consequences. Keep `ARCHITECTURE.md` focused on resulting current structure.
10. Remove completed work from `NOW.md`; keep history in Git, issues, pull requests, and ADRs.
11. For non-trivial work, identify the normative inputs, implementation outputs or boundaries, and verification evidence.
12. When code, tests, requirements, or ADRs disagree, preserve the conflict, classify the owning defect, and resolve the intended behavior explicitly.
13. Do not put credentials, private task identifiers, private URLs, or production data in repository documents.
