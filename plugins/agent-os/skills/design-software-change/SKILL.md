---
name: design-software-change
description: Design or review a non-trivial software change using repository-owned domain facts and portable principles for naming, domain modeling, Deep Modules, database modeling, and API contracts. Use before implementation when a task introduces or changes domain language, module boundaries, responsibilities, public interfaces, persistent data, schemas, state transitions, integrations, or architectural structure; also use when reviewing shallow modules, leaky abstractions, vague names, or design inconsistency.
---

# Design a software change

Produce the smallest coherent design that preserves project truth in the target repository and hides meaningful complexity behind stable boundaries. Apply design before implementation, then let tests and code validate it.

## Workflow

1. Read [design-precedence.md](references/design-precedence.md), the nearest repository instructions, existing code, tests, contracts, domain context, ADRs, schemas, and API specifications. Never invent project-specific facts inside the plugin.
2. State the change in the repository's current domain language. Resolve ambiguous terms, ownership, invariants, state transitions, failure behavior, and compatibility constraints before choosing modules or storage.
3. Identify the affected design surfaces and load only their references:
   - Read [naming-and-types.md](references/naming-and-types.md) for new or changed names, types, identifiers, units, or public vocabulary.
   - Read [domain-modeling.md](references/domain-modeling.md) for domain concepts, bounded contexts, entities, value objects, invariants, state transitions, or ownership.
   - Read [deep-modules.md](references/deep-modules.md) for module boundaries, abstractions, dependencies, orchestration, adapters, or refactoring.
   - Read [database-design.md](references/database-design.md) for persistent data, schemas, queries, transactions, access control, or migrations.
   - Read [api-design.md](references/api-design.md) for internal or external APIs, events, commands, routes, SDKs, or provider boundaries.
4. Propose one primary design. Describe responsibilities, interfaces, hidden decisions, data ownership, invariants, errors, compatibility, and the tests that prove the boundary. Present alternatives only when a real trade-off remains.
5. Stress-test the design with normal, boundary, failure, retry, concurrency, authorization, and migration scenarios that apply. Simplify interfaces and remove special cases where the domain permits it.
6. Apply Deep Modules, information hiding, complexity pull-down, and the deletion test. Reject pass-through layers, generic catch-all abstractions, duplicated policy, and class proliferation that do not reduce caller knowledge.
7. Persist concrete decisions in the target repository, not this plugin. Update its code contracts, tests, `AGENTS.md`, domain context, schema, API specification, or a justified ADR according to repository conventions.
8. Hand the approved design to implementation with a concise checkpoint: terms, invariants, module/API boundaries, data ownership, compatibility, verification, documentation impact, and unresolved risks.

## Design standard

- Prefer one concept, one canonical term, and one owner.
- Prefer domain-specific interfaces that hide policy over generic CRUD or configuration surfaces that leak it.
- Keep interfaces smaller than the complexity they hide; count required knowledge, not method count alone.
- Make invalid states difficult or impossible to represent when the language and repository permit it.
- Keep policy decisions visible where callers must choose them; pull mechanical complexity, defaults, recovery, and provider quirks downward.
- Preserve existing public behavior unless the approved scope explicitly changes it.
- Follow repository tooling for casing, formatting, generated contracts, framework layout, and enforceable syntax.

## Stop conditions

Stop and ask a concrete question when canonical terminology, ownership, invariants, authorization, compatibility, or irreversible trade-offs cannot be resolved from approved scope and repository evidence. Do not fill gaps with a fashionable pattern.
