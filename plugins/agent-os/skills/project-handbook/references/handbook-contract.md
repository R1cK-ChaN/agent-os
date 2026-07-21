# Project handbook contract

The project handbook is a small, repository-owned working set, not a document warehouse.

| File | Owns | Update when |
| --- | --- | --- |
| `README.md` | Project entry point and first commands | The project entry path or stable setup changes |
| `AGENTS.md` | Collaboration rules and local constraints | Repository workflow or ownership rules change |
| `docs/INDEX.md` | Document routing and fact precedence | The handbook shape or source ordering changes |
| `docs/REQUIREMENTS.md` | Numbered requirements | Required behavior changes |
| `docs/NOW.md` | Current work, blockers, decisions, and handoff | Work starts, changes state, blocks, or completes |
| `docs/ARCHITECTURE.md` | Current system boundaries and responsibilities | Architecture or data flow changes |
| `docs/INTERFACES.md` | Cross-module and provider contracts | A boundary, schema, error, or compatibility rule changes |
| `docs/decisions/` | Append-only decision history | A surprising, hard-to-reverse trade-off is accepted |
| `docs/runbooks/` | Operational procedures | An operator-facing procedure changes |
| `docs/references/` | Curated external or supporting references | A durable reference is needed by the project |

When a project already uses equivalent paths or generated contracts, preserve them and link them from `docs/INDEX.md` instead of creating duplicate sources of truth.

## Documentation compilation contract

Treat the handbook as the repository's semantic source set, not as a prose mirror of the code:

- **Normative intent** states what the system should do and why. Accepted requirements and ADRs own this intent.
- **Boundary contracts** state the observable rules between modules, users, and providers. Human-readable interfaces link to the owning schemas, types, or specifications when they exist.
- **Implementation evidence** shows what the current artifact does and whether it satisfies the intent. Code, automated tests, static checks, and recorded manual checks provide evidence; generation by an Agent is not evidence by itself.

An accepted requirement that is ready for implementation has a stable identifier, one atomic and externally observable behavior or constraint, applicable interface or boundary references, and a falsifiable verification path. When automation would not be meaningful, name a concrete manual check instead of claiming implicit coverage. Trace requirements to verification and owning implementation boundaries; do not require line-level requirement comments that become stale during refactoring.

Each non-trivial implementation slice records:

1. the normative inputs it intends to compile, including applicable requirement, interface, and ADR identifiers;
2. the implementation outputs or boundaries it may change; and
3. the verification evidence that can disprove conformance.

Traceability is a routing and coverage signal, not proof of semantic correctness. Repository tests and review must still challenge whether the output implements the intended behavior.

## Resolving compilation drift

When intent, contracts, code, or evidence disagree, preserve the observed conflict and classify it before editing:

- **Specification defect:** the normative intent is wrong, missing, or ambiguous. Correct the source decision first, then its evidence and implementation.
- **Implementation defect:** the intent and boundary are clear, but the compiled behavior does not conform. Keep the source stable, add or retain a failing check, and repair the implementation.
- **Verification defect:** the intended behavior is clear, but the evidence cannot detect a known non-conforming result. Strengthen the check before or with the implementation repair.
- **Unrecorded intent change:** stakeholders now want behavior that no accepted source authorizes. Record and approve the changed intent before compiling it.

Do not update documentation merely to describe an accidental implementation, and do not change correct normative text during an implementation-only repair. Resolve the owning layer and update every affected view in the same branch.
