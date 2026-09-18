# Project handbook contract

The project handbook is a small, repository-owned working set, not a document warehouse.

| File | Owns | Update when |
| --- | --- | --- |
| `README.md` | Project entry point and first commands | The project entry path or stable setup changes |
| `AGENTS.md` | Collaboration rules and local constraints | Repository workflow or ownership rules change |
| `docs/INDEX.md` | Document routing and fact precedence | The handbook shape or source ordering changes |
| `docs/REQUIREMENTS.md` | Stable observable requirements | Required behavior changes |
| `docs/ARCHITECTURE.md` | Current system boundaries and responsibilities | Architecture or data flow changes |
| `docs/INTERFACES.md` | Cross-module and provider contracts | A boundary, schema, error, or compatibility rule changes |
| `docs/decisions/` | Append-only decision history | A surprising, hard-to-reverse trade-off is accepted |
| `docs/runbooks/` | Operational procedures | An operator-facing procedure changes |
| `docs/references/` | Curated supporting references | A durable reference is needed by the project |

Preserve equivalent existing paths and link them from the document map instead of creating duplicate sources of truth.

## Semantic roles

- **Normative intent** states what the system should do and why. Accepted requirements and ADRs own it.
- **Boundary contracts** state observable rules between modules, users, and providers. Human-readable interfaces link to owning schemas, types, or specifications.
- **Implementation evidence** shows what the artifact currently does. Code, automated tests, static checks, and recorded manual checks provide evidence; generated prose does not.

An implementation-ready requirement should be observable or constraining, name applicable boundaries, and have a falsifiable automated or manual verification path. Traceability is a routing and coverage signal, not proof of correctness.

## Risk-scaled documentation

Do not require pre-implementation documentation for ordinary fixes, localized features, or internal refactors. Update durable documents alongside code only when system meaning changes.

Document a major change before executable implementation when it changes canonical terms or invariants; public interfaces, protocols, compatibility, or failure behavior; durable schemas, migrations, data ownership, authorization, or privacy; cross-system responsibilities or data flow; external integration or release behavior; or a hard-to-reverse architecture choice.

For a major change:

1. Identify the normative inputs and affected boundaries.
2. Update only the owning requirements, interfaces, architecture sections, or ADRs.
3. Name verification capable of disproving conformance.
4. Resolve material semantic gaps before code.
5. Continue into implementation once the design is coherent and authorized.

The documentation-first step does not require an issue, a numbered branch, or a separate first commit. A separate documentation checkpoint is useful when another person needs to review the design, the work spans replaceable environments, or repository policy requires it. Otherwise documentation and implementation may be delivered together.

Faithful elaboration of already approved intent needs no second approval. A **material semantic delta** is new meaning that changes product behavior, scope, authorization, privacy, protocol, observable failure behavior, data ownership, public compatibility, provider choice, or a hard-to-reverse trade-off. When repository evidence cannot resolve such a delta, ask one focused question before implementation.

TDD verifies implementation; it does not authorize unresolved product or architecture intent. Conversely, prose scaffolding does not need an artificial failing executable test. Validate documentation with the narrowest applicable structure, reference, privacy, formatting, and repository checks.

## Resolving drift

When intent, contracts, code, or evidence disagree, preserve the conflict and classify it before editing:

- **Specification defect:** the normative intent is wrong, missing, or ambiguous.
- **Implementation defect:** the intent and boundary are clear, but behavior does not conform.
- **Verification defect:** the intended behavior is clear, but evidence cannot detect a known failure.
- **Unrecorded intent change:** stakeholders want behavior that no accepted source authorizes.

Correct the owning layer. Do not update documentation merely to describe accidental behavior, and do not change correct normative text during an implementation-only repair.
