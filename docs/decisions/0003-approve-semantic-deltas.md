# ADR 0003: Approve semantic deltas instead of compiled documents

- Status: Accepted
- Date: 2026-07-29
- Issue: #16
- Supersedes: The complete-baseline user-review requirement in ADR 0002

## Context

ADR 0002 established that an approved documentation-only baseline must precede
executable implementation. It required the complete compiled baseline to be
presented for another user review before commit and push.

The structured issue has already been reviewed as the implementation scope and
semantic authority. When the baseline faithfully compiles that approved intent
into requirements, interfaces, architecture, decisions, and the current
handoff, reviewing every document again approves no new meaning. The redundant
approval adds latency and teaches Agents to ask broad questions instead of
isolating the actual unresolved decision.

Compilation can still reveal information that the approved issue does not
authorize: a provider or dependency, protocol or failure rule, security or
privacy boundary, persistent-data owner, public compatibility constraint,
scope change, or irreversible architectural trade-off. Those are material
semantic deltas. They require authority before persistence and must not be
deferred to implementation tests.

## Decision

Explicit approval of the structured implementation issue authorizes the Agent
to compile, deterministically validate, commit, push, and checkpoint a
semantically equivalent documentation-only baseline. No second review of the
complete baseline is required.

Before persistence, the Agent compares the baseline with the approved issue and
repository evidence:

- Formatting, routing, traceability, identifiers, and faithful elaboration that
  do not change approved meaning are semantic-equivalent compilation.
- New product behavior, scope, provider or dependency, authorization or privacy
  behavior, protocol or observable failure rule, persistent-data ownership,
  public compatibility constraint, or durable architectural trade-off is a
  material semantic delta unless already authorized.

When a material delta cannot be resolved from approved scope and repository
evidence, the Agent stops before committing and asks one concrete question about
only that delta. If the answer changes intent or scope, the Agent updates the
owning issue and normative document first. Once the delta is resolved and no
other material delta remains, the Agent persists the baseline automatically
without requesting another full-document review.

An unresolved invariant, protocol, architecture choice, or observable failure
behavior cannot be postponed to Red-Green-Refactor. TDD verifies the compiled
implementation; it does not supply missing product or architecture authority.

All other decisions in ADR 0002 remain in effect, including the requirement
that the documentation-only baseline be the first commit unique to the issue
branch, be pushed and recorded on the issue before executable implementation,
and use deterministic document checks instead of TDD.

## Alternatives considered

### Review every compiled baseline

This preserves a clear approval point but duplicates the already approved issue
when no semantic delta exists. It also encourages broad review requests that
hide the one decision that actually needs authority.

### Let the Agent decide every newly discovered detail

This minimizes interruption but silently expands authority for consequential
business, provider, security, persistence, compatibility, and architecture
choices.

### Defer unresolved choices to the first TDD slice

Tests can prove that code follows a chosen rule, but they cannot authorize which
provider, invariant, failure policy, or compatibility behavior the project
should choose. This would make code the first source of intent.

### Ask focused questions but still request final full review

The focused decision already supplies the missing authority. A final complete
review would recreate the redundant approval after every delta is resolved.

## Consequences

- Normal issue-to-document compilation proceeds without a second user pause.
- User attention is reserved for new meaning rather than generated prose.
- Agents must distinguish faithful elaboration from material semantic change.
- Focused questions and issue updates preserve authority when the approved scope
  is incomplete.
- Semantic equivalence remains an evidence-based judgment, not a mathematical
  or automated proof.
- More specific repository instructions may retain a separate document-review
  gate when the repository has a concrete reason for it.

## Compatibility and migration

This decision applies prospectively after the updated Agent OS workflow is
installed. Existing issue branches and documentation baselines are not changed.
Repositories with a closer `AGENTS.md` or established compatible approval
process remain authoritative.

The global Codex `AGENTS.md` activates this rule concisely; Agent OS owns the
detailed semantic-delta contract.

## Verification

- Confirm an approved issue with a semantically equivalent baseline proceeds
  through validation, commit, push, and issue checkpoint without another full
  review.
- Confirm a newly discovered material delta stops before commit and produces
  one focused question.
- Confirm an accepted intent or scope change updates the issue and owning
  normative document before persistence.
- Confirm resolving the delta resumes automatic persistence without another
  complete-baseline approval.
- Confirm unresolved protocol or architecture choices are not deferred to TDD.
- Run repository, Skill, Plugin, privacy, formatting, and contract checks.
