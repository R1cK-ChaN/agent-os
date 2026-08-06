# Project handbook contract

The project handbook is a small, repository-owned working set, not a document warehouse.

| File | Owns | Update when |
| --- | --- | --- |
| `README.md` | Project entry point and first commands | The project entry path or stable setup changes |
| `AGENTS.md` | Collaboration rules and local constraints | Repository workflow or ownership rules change |
| `docs/INDEX.md` | Document routing and fact precedence | The handbook shape or source ordering changes |
| `docs/REQUIREMENTS.md` | Numbered requirements | Required behavior changes |
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

## Pre-implementation documentation baseline

For non-trivial work under the default Agent OS lifecycle, create the approved
implementation issue and its issue-scoped branch before changing project
documents. Then compile the approved discussion, issue, and applicable design
decisions into the repository's owning normative documents:

- update requirements when required behavior changes;
- update interfaces or their owning specifications when a boundary changes;
- update architecture when current responsibilities or data flow change;
- add an ADR when a durable, surprising, or hard-to-reverse decision has a real
  trade-off whose rationale must survive the current structure.

Record shared task progress, blockers, verification, and the next observable
step on the owning GitHub issue or pull request. Keep session-local recovery
context in a private checkpoint outside tracked target-repository files.

Use equivalent repository-owned documents when the project already has them.
Do not create duplicate handbook files merely to satisfy the default paths.

Issue approval authorizes the Agent to compile, validate, commit, push, and
checkpoint a semantically equivalent documentation-only baseline. Compare the
compiled baseline with the approved issue and repository evidence; faithful
elaboration, identifiers, formatting, routing, and traceability that do not
change approved meaning require no second approval.

Without a second full-document review, run the narrowest applicable
document-structure, reference, traceability, privacy, formatting, and repository
checks. Red-Green-Refactor does not apply to this documentation-only baseline
because it changes no executable behavior. Commit it as the first commit unique
to the issue branch, push it, and record the baseline commit on the owning
GitHub issue before executable implementation. The baseline must identify the
normative inputs, intended implementation outputs or owning boundaries, and
verification evidence for the planned implementation.

A **material semantic delta** is new meaning not authorized by the approved
issue or repository evidence, including new product behavior or scope, a
provider or dependency, authorization or privacy behavior, a protocol or
observable failure rule, persistent-data ownership, a public compatibility
constraint, or a durable architectural trade-off. When a material semantic
delta cannot be resolved from approved evidence, stop before committing and ask
one concrete question about only that delta.

If the answer changes intent or scope, update the owning issue and normative
document before persistence. After the delta is resolved and no other material
delta remains, persist the completed baseline automatically without another
full-document review.

An unresolved invariant, protocol, architecture choice, or observable failure
behavior must not be deferred to Red-Green-Refactor. TDD verifies the compiled
implementation; it does not authorize missing product or architecture intent.
During implementation, update an accepted intent change in its owning normative
document before making the corresponding implementation change. Do not let code
become the first durable source of intentional behavior.

Architecture and ADRs are complementary: architecture describes the current
system structure, while an applicable ADR preserves why a consequential choice
was made, which alternatives were considered, and what consequences or
compatibility constraints follow. Do not create an ADR for routine details that
lack a durable trade-off.

## Continue after the baseline

The pushed and recorded documentation baseline is a recovery checkpoint, not a
pause or completion condition. When the approved issue includes executable
implementation and no permitted stop condition applies, continue directly into
Red. The next observable action is the smallest failing implementation test or
deterministic Red check, not a message announcing that implementation will
begin later.

Do not ask the user to say “continue” merely because the baseline was committed,
pushed, recorded, or left a clean worktree. Use the checkpoint-development
contract for the narrow stop conditions and external-wait resume evidence.

## Resolving compilation drift

When intent, contracts, code, or evidence disagree, preserve the observed conflict and classify it before editing:

- **Specification defect:** the normative intent is wrong, missing, or ambiguous. Correct the source decision first, then its evidence and implementation.
- **Implementation defect:** the intent and boundary are clear, but the compiled behavior does not conform. Keep the source stable, add or retain a failing check, and repair the implementation.
- **Verification defect:** the intended behavior is clear, but the evidence cannot detect a known non-conforming result. Strengthen the check before or with the implementation repair.
- **Unrecorded intent change:** stakeholders now want behavior that no accepted source authorizes. Record and approve the changed intent before compiling it.

Do not update documentation merely to describe an accidental implementation, and do not change correct normative text during an implementation-only repair. Resolve the owning layer and update every affected view in the same branch.
