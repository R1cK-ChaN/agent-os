# ADR 0004: Checkpoints do not pause authorized work

- Status: Accepted
- Date: 2026-07-30
- Issue: #18
- Related: ADR 0002, ADR 0003

## Context

Agent OS requires a documentation-only baseline before executable
implementation and encourages durable checkpoints after coherent phases. These
checkpoints protect recovery in replaceable environments, but the workflow does
not explicitly distinguish persistence from a user-facing pause.

An Agent can therefore commit, push, and record a valid documentation baseline,
then end its turn by announcing that TDD will happen next. When the approved
Issue includes implementation and no semantic delta, blocker, external wait, or
manual gate exists, this incorrectly narrows the task to the completed phase and
requires the user to say “continue.”

The same ambiguity applies to later phase commits. Persistence is valuable, but
commit, push, and issue commentary are evidence of progress rather than
completion conditions.

## Decision

A checkpoint preserves coherent recovery evidence. It does not by itself pause,
complete, deliver, or narrow the approved task.

After a documentation baseline is committed, pushed, and recorded, the Agent
continues directly into Red when the approved Issue includes executable
implementation. The next observable action must be the smallest failing test or
deterministic Red check, not an announcement that the next phase will start
later.

After any later checkpoint, the Agent continues with the next safe, authorized,
locally executable action in the same task. Commit, push, issue comment, phase
completion, and a clean working tree are not stop conditions.

The Agent may yield control only when:

- a material semantic delta requires authority;
- a concrete permission, capability, credential, dependency, or safety blocker
  prevents the next action;
- an external wait is required;
- the approved scope is documentation-only or otherwise complete;
- the user explicitly requested a pause; or
- a closer repository rule requires a specific manual gate.

When an external wait is required, the durable checkpoint names the exact event
or state that permits resumption. When work is only `recoverable-only`, the
Agent must not call it delivered or complete. It continues if another safe local
action remains available.

Ending a turn while authorized local work remains and none of the permitted stop
conditions applies is a workflow defect. The Agent must not ask the user to say
“continue” merely because a phase was persisted.

## Alternatives considered

### Pause after every pushed phase

This maximizes user control but duplicates the authority already granted by the
approved Issue and turns normal delivery into repeated manual orchestration.

### Avoid intermediate checkpoints

This removes the ambiguous boundary but weakens recovery and reviewability in
replaceable environments.

### Continue through every condition

This avoids unnecessary pauses but would cross real authority, safety,
capability, external-wait, and repository-required gates.

### Add a background workflow engine

The problem is a missing execution contract, not missing scheduling
infrastructure. A daemon or hosted orchestrator would add unrelated complexity
and authority.

## Consequences

- Documentation-first delivery proceeds into implementation without another
  user message.
- Intermediate commits remain recoverable without fragmenting the task.
- Stop conditions become explicit and auditable.
- Agents must distinguish external waiting from locally executable follow-up.
- Long tasks may span multiple model turns or environments, but each stop must
  have a real condition rather than a completed phase.

## Compatibility and migration

This decision applies prospectively after the updated Plugin is installed.
Existing branches and checkpoints are not rewritten. More specific repository
instructions and explicit user pauses remain authoritative.

ADR 0002 still owns the requirement for a documentation-first commit. ADR 0003
still owns semantic-delta approval. This ADR owns continuation after durable
persistence.

## Verification

- Confirm an implementation-scoped Issue moves from its recorded documentation
  baseline directly to a failing implementation check.
- Confirm ordinary commits, pushes, issue comments, phase completion, and a
  clean worktree do not stop authorized work.
- Confirm every permitted stop names its concrete condition.
- Confirm external waits record their resume event or state.
- Confirm recoverable-only work is not described as delivered.
- Confirm a task does not ask the user to say “continue” solely because a phase
  checkpoint was persisted.
