# Project collaboration rules

This file is the repository's local working agreement for people and Agents.

1. Read `README.md`, `docs/INDEX.md`, and only the task-relevant requirements, interfaces, architecture sections, and ADRs before changing code.
2. Preserve unrelated work and follow existing repository conventions.
3. Ordinary fixes, localized features, and internal refactors do not require an issue or a pre-implementation documentation baseline.
4. Before a major change, document affected public contracts, persistent data, authorization, cross-system responsibilities, or hard-to-reverse architecture when the repository has an owning document.
5. Ask one focused question when a major semantic decision cannot be resolved from the request and repository evidence; do not guess silently.
6. Update code, tests, and affected durable documents in the same delivered change. Use a separate documentation checkpoint only when shared review, recovery, or repository policy makes it useful.
7. Update `INTERFACES.md` when a cross-module or external contract changes.
8. Add an ADR only when a consequential decision needs to preserve its alternatives and rationale. Keep `ARCHITECTURE.md` focused on current structure.
9. Use the narrowest verification capable of falsifying the changed behavior and expand only for demonstrated risk.
10. Keep task progress and session handoffs outside tracked handbook files.
11. When code, tests, requirements, or ADRs disagree, classify and resolve the owning defect explicitly.
12. Do not put credentials, private task metadata, private URLs, or production data in repository documents.
