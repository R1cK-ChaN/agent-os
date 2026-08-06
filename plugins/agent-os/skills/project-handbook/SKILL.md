---
name: project-handbook
description: Create and maintain a repository-owned project handbook that gives people and Agents a current, privacy-safe view of durable requirements, architecture, interfaces, and decisions.
---

# Project handbook

Use this Skill when a target repository is adopting, reading, or updating the shared project handbook. The handbook belongs to the target repository; Agent OS supplies the method and starter templates but never copies project facts into the Plugin.

## Read order

Read the smallest useful route through the handbook:

1. `README.md` and the nearest `AGENTS.md`.
2. `docs/INDEX.md` for the project's document map and fact precedence.
3. Only the requirements, interface contracts, architecture sections, and ADRs relevant to the current task.
4. Runbooks and references only when the task needs operational or external context.

Obtain shared task progress and handoff context from the approved issue or pull
request. Private checkpoints may supplement session recovery but are not part
of the shared handbook.

Do not load the entire decision history by default. Use the index, links, identifiers, and current task to select relevant context.

## Ownership and update rules

- `REQUIREMENTS.md` owns stable, numbered product or system requirements.
- `INTERFACES.md` owns human-readable cross-boundary contracts and links to machine-readable schemas or generated specifications.
- `ARCHITECTURE.md` owns current boundaries, responsibilities, and data flow.
- `decisions/` owns append-only ADR history for important, hard-to-reverse decisions.
- `AGENTS.md` owns repository collaboration rules.
- Issues and pull requests own shared task scope, progress, blockers,
  verification evidence, and resume conditions.
- Private checkpoints may own session-local recovery context but remain outside
  tracked target-repository files and are not project truth.

Update code, tests, and affected durable handbook documents in the same branch
and pull request. Task progress alone is not a handbook change. If a section has
no impact, record that conclusion in the review or issue rather than inventing
documentation changes.

Use the documentation compilation contract in `references/handbook-contract.md`
for non-trivial work. After the approved issue and issue branch exist, compile
the approved intent into the affected project documents. Issue approval
authorizes deterministic validation and persistence of a semantically equivalent
documentation-only baseline as the first commit unique to the branch before
executable implementation; do not request a second full-document review.
Identify normative inputs, implementation outputs or owning boundaries, and
verification evidence. Treat traceability as a coverage signal rather than
proof that Agent-generated output is correct.

The baseline is prose-only work, so Red-Green-Refactor does not apply. Run the
narrowest deterministic document, reference, privacy, formatting, and
repository checks instead. Stop before commit only when compilation reveals a
material semantic delta that approved scope and repository evidence cannot
resolve. Ask one concrete question about that delta, update the issue and owning
normative source when intent changes, then persist automatically after
resolution. Do not defer an unresolved protocol, invariant, architecture
choice, or observable failure behavior to TDD.

After the baseline is pushed and recorded, continue directly into Red when
executable implementation remains in scope and the checkpoint contract names no
stop condition. The documentation checkpoint preserves recovery evidence; it
does not pause, complete, or narrow the task.

## Conflicts and privacy

Separate actual behavior from intended behavior. Code and tests show what
currently happens; requirements and accepted ADRs show what the project
intends; interface definitions show the contract at a boundary; the approved
issue and pull request show where task execution currently stands. When these
disagree, record the discrepancy and resolve it explicitly. Do not silently
rewrite history or lower a test standard.

Classify a disagreement as a specification defect, implementation defect, verification defect, or unrecorded intent change, then correct the owning layer. Do not rewrite normative intent merely to match accidental implementation behavior.

Use only repository-safe task references in handbook files, such as public issue numbers, branches, or local task identifiers. Never write private task-system identifiers, private URLs, credentials, or copied production data into repository-facing documents.

## Initialization

When the handbook is absent, use the explicit `init-handbook` command if the Agent OS checkout is available. It creates only missing files. Existing files and repository conventions take precedence; do not overwrite or rename them automatically.
