---
name: project-handbook
description: Create, read, or maintain a repository-owned project handbook containing durable requirements, architecture, interfaces, and decisions. Use when a repository explicitly adopts a handbook, when system meaning changes, or before a major change involving public contracts, persistent data, authorization, cross-system responsibilities, or hard-to-reverse architecture. Do not require a pre-implementation documentation baseline for ordinary fixes, features, or refactors.
---

# Project handbook

Keep durable project meaning easy for people and Agents to find. The target repository owns all project facts; Agent OS supplies only the documentation method and starter templates.

## Read order

1. Read `README.md` and the nearest `AGENTS.md`.
2. Read `docs/INDEX.md` or the repository's equivalent document map.
3. Load only the requirements, interface contracts, architecture sections, and ADRs relevant to the current task.
4. Read runbooks and external references only when the task needs them.

Do not load the entire decision history by default. Task progress and session handoffs are not durable project meaning and should not be added to handbook files.

## Ownership

- `REQUIREMENTS.md` owns stable, observable product or system requirements.
- `INTERFACES.md` owns human-readable cross-boundary contracts and links to schemas or generated specifications.
- `ARCHITECTURE.md` owns current boundaries, responsibilities, and data flow.
- `decisions/` owns append-only rationale for important, hard-to-reverse choices.
- `AGENTS.md` owns repository collaboration rules.
- Runbooks own operator procedures.
- Code, tests, schemas, and generated specifications provide implementation evidence.

Use equivalent repository-owned paths when they already exist. Do not create duplicate sources of truth.

## Update policy

For ordinary fixes, localized features, and internal refactors, do not create a pre-implementation documentation baseline. Update an existing handbook document in the same change only when observable behavior, a boundary contract, current responsibility, or durable rationale actually changes.

For a major change, document the affected durable meaning before executable implementation when it changes any of the following:

- canonical domain language or invariants;
- public API, event, protocol, compatibility, or failure semantics;
- durable schema, migration, data ownership, authorization, or privacy;
- cross-module or cross-service responsibility and data flow;
- external integration or release behavior;
- a hard-to-reverse dependency or architectural trade-off.

This documentation-first step does not require an external task tracker, a GitHub issue, or a separate first commit. Persist it as an independent checkpoint only when shared review, long-running recovery, or repository policy makes that useful. If the documentation faithfully expresses already approved intent, do not request a second approval. Stop and ask one focused question only when repository evidence cannot resolve new meaning, scope, or an irreversible choice.

Read [handbook-contract.md](references/handbook-contract.md) for document ownership, major-change criteria, and conflict handling.

## Conflicts and privacy

Separate intended behavior from observed behavior. Classify disagreements as a specification defect, implementation defect, verification defect, or unrecorded intent change, then correct the owning layer. Do not rewrite normative intent merely to match accidental code.

Never write credentials, private URLs, private task metadata, copied production data, or session-local recovery details into repository-facing handbook documents.

## Initialization

When the handbook is absent, use the explicit `init-handbook` command only when the user asks to adopt it or the repository workflow requires it. It creates missing files without overwriting or renaming existing repository documents.
