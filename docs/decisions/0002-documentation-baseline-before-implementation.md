# ADR 0002: Require a documentation baseline before implementation

- Status: Accepted
- Date: 2026-07-29
- Issue: #14

## Context

Agent OS treats accepted requirements and decisions as normative intent,
interfaces and schemas as boundary contracts, and code plus checks as
implementation evidence. The project-handbook compilation contract defines
those roles, but the delivery lifecycle does not yet guarantee that an approved
conversation and issue are persisted into repository-owned documents before
implementation begins.

Chat is ephemeral, an issue is an implementation scope boundary rather than the
long-term owner of all project facts, and code can accidentally become the first
durable expression of a decision. When that happens, documentation is updated
after implementation and can become a prose mirror of code instead of its
semantic source.

The workflow needs a durable point at which people and Agents can review what
will be compiled before executable behavior changes. It must preserve
repository-specific document conventions, avoid forcing test-driven development
onto prose-only work, and retain the reason for consequential design choices
rather than only describing the resulting structure.

## Decision

For every non-trivial change using the default Agent OS delivery lifecycle:

1. Approve and create the implementation issue.
2. Create its issue-scoped branch.
3. Compile the approved intent into the target repository's owning normative
   documents and current handoff.
4. Record applicable architectural rationale in an ADR when the decision is
   durable, surprising, difficult to reverse, or based on a real trade-off.
5. Present the documentation baseline for user review.
6. Commit the approved documentation-only baseline as the first commit unique
   to the issue branch, push it, and record its commit on the issue.
7. Begin executable implementation only after that durable checkpoint.

The documentation baseline is not subject to Red-Green-Refactor because it
changes no executable behavior. It must instead pass the narrowest deterministic
document-structure, reference, traceability, privacy, formatting, and repository
checks that apply.

`ARCHITECTURE.md` owns the resulting current system structure. ADRs own the
reasoning, alternatives, and consequences of applicable architectural
decisions. Requirements own required behavior, interfaces own boundary
contracts, and `NOW.md` owns the current handoff. Equivalent repository-owned
documents take precedence over the default handbook paths.

If accepted intent changes during implementation, the owning normative document
must be updated before the corresponding executable change. Documentation and
implementation may be completed in later coherent slices, but code must not
become the first source of an intentional behavior change.

## Alternatives considered

### Update documentation in the same commit as implementation

This keeps a pull request internally consistent but provides no reviewable
semantic input before code is written. It also makes it difficult to determine
whether documentation authorized the implementation or merely described it
afterward.

### Keep the approved design only in the GitHub issue

The issue is the delivery scope and durable implementation record, but it is not
the canonical long-term owner of project requirements, interfaces,
architecture, or design rationale. Closed issues are also a poor routing layer
for future Agents.

### Require TDD for the documentation baseline

A failing executable test is not meaningful evidence for a prose-only baseline.
Inventing one would confuse implementation conformance with document validation.
Deterministic structural and consistency checks are the appropriate evidence.

### Create an ADR for every change

This would preserve rationale at the cost of excessive navigation and
low-signal decision history. ADRs remain reserved for decisions with a real,
durable trade-off or context that future maintainers would not recover safely
from the current architecture alone.

## Consequences

- Approved intent becomes durable and reviewable before implementation.
- The first branch commit provides a stable recovery and comparison point.
- A fresh environment can recover design intent from the issue, branch, and
  repository without relying on chat history.
- Implementation begins later because the documentation baseline requires a
  separate review and checkpoint.
- Repositories must be able to identify equivalent normative documents when
  they do not use the default handbook paths.
- Documentation checks must not be represented as proof that later generated
  code is semantically correct.

## Compatibility and migration

The rule applies prospectively to new non-trivial issue branches after the
updated workflow is installed. Existing branches and handbooks are not rewritten
or reordered automatically. A closer repository `AGENTS.md` or established
workflow may define a more specific compatible convention.

The global Codex `AGENTS.md` should activate this method concisely. The detailed
contract remains owned by Agent OS so local defaults do not become a second,
drifting implementation of the workflow.

## Verification

- Confirm the issue branch's first unique commit changes documentation only.
- Confirm the baseline identifies normative inputs, intended implementation
  boundaries, and falsifiable verification evidence.
- Confirm applicable ADRs explain context, alternatives, consequences, and
  compatibility while architecture documentation describes current structure.
- Run the repository's deterministic documentation, privacy, formatting, Skill,
  and Plugin validation.
- Confirm implementation checks fail before the workflow contract is updated
  and pass afterward.
- Reinstall the local plugin through the supported cachebuster flow and verify
  the updated workflow in a new Codex thread.
