---
name: project-handbook
description: Create and maintain a repository-owned project handbook that gives people and Agents one current, privacy-safe view of requirements, architecture, interfaces, decisions, and next work.
---

# Project handbook

Use this Skill when a target repository is adopting, reading, or updating the shared project handbook. The handbook belongs to the target repository; Agent OS supplies the method and starter templates but never copies project facts into the Plugin.

## Read order

Read the smallest useful route through the handbook:

1. `README.md` and the nearest `AGENTS.md`.
2. `docs/INDEX.md` for the project's document map and fact precedence.
3. `docs/NOW.md` for the current handoff.
4. Only the requirements, interface contracts, architecture sections, and ADRs relevant to the current task.
5. Runbooks and references only when the task needs operational or external context.

Do not load the entire decision history by default. Use the index, links, identifiers, and current task to select relevant context.

## Ownership and update rules

- `REQUIREMENTS.md` owns stable, numbered product or system requirements.
- `INTERFACES.md` owns human-readable cross-boundary contracts and links to machine-readable schemas or generated specifications.
- `ARCHITECTURE.md` owns current boundaries, responsibilities, and data flow.
- `decisions/` owns append-only ADR history for important, hard-to-reverse decisions.
- `NOW.md` owns only the current work, blockers, open decisions, and safe handoff. Remove completed entries; do not turn it into a changelog.
- `AGENTS.md` owns repository collaboration rules.

Update code, tests, and affected handbook documents in the same branch and pull request. If a section has no impact, record that conclusion in the review or issue rather than inventing documentation changes.

Use the documentation compilation contract in `references/handbook-contract.md` for non-trivial work. Identify normative inputs, implementation outputs or owning boundaries, and verification evidence. Treat traceability as a coverage signal rather than proof that Agent-generated output is correct.

## Conflicts and privacy

Separate actual behavior from intended behavior. Code and tests show what currently happens; requirements and accepted ADRs show what the project intends; interface definitions show the contract at a boundary; `NOW.md` shows where work currently stands. When these disagree, record the discrepancy and resolve it explicitly. Do not silently rewrite history or lower a test standard.

Classify a disagreement as a specification defect, implementation defect, verification defect, or unrecorded intent change, then correct the owning layer. Do not rewrite normative intent merely to match accidental implementation behavior.

Use only repository-safe task references in handbook files, such as public issue numbers, branches, or local task identifiers. Never write private task-system identifiers, private URLs, credentials, or copied production data into repository-facing documents.

## Initialization

When the handbook is absent, use the explicit `init-handbook` command if the Agent OS checkout is available. It creates only missing files. Existing files and repository conventions take precedence; do not overwrite or rename them automatically.
