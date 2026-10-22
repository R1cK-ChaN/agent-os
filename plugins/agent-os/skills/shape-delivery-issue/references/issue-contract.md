# Issue contract

A delivery issue is an execution contract. The delivering agent treats its scope, decisions, and delivery endpoint as approved and stops only when the issue is wrong or incomplete. Write it so that agent never needs the discussion that produced it.

## Template

Omit a section only when the note under it says it is optional.

```markdown
## Goal

What changes for whom, in one or two sentences.

## Context

Why this is needed, current behavior, and links to related issues, pull requests, or documents.

## Scope

- What the change includes.

## Non-goals

- What the change must not do, including tempting adjacent work.

## Decisions

- <decision> — <rationale>. Rejected: <alternative> because <reason>.

## Design

Required for a major change; optional otherwise. Canonical terms, invariants, interfaces, data ownership, compatibility, and the durable documents to update before implementation.

## Acceptance criteria

- [ ] <observable, verifiable outcome>

## Verification

Commands or checks that prove the acceptance criteria, and any integration or staging evidence needed.

## Starting points

Files, modules, documents, or tests where the work begins.

## Delegated choices

Optional. Choices left to the delivering agent, each with the rule it must follow, for example: "Pick the error code; reuse an existing code when one fits."

## Delivery

- Change class: ordinary | major
- Base branch: <default branch>
- Endpoint: merge after CI (default) | stop at pull request
- Release: none | staging | production (production requires explicit approval)
```

## Handoff check

Before creating the issue, confirm each item. A failing item blocks creation until it is resolved or delegated with a rule.

- A fresh agent with only the repository and this issue can tell what done means. Every acceptance criterion is observable and verifiable.
- Nothing points to the conversation, such as "as discussed" or "the approach above".
- Every path, command, term, and interface named exists in the repository or is explicitly marked as new.
- Scope and non-goals are explicit enough that the agent will not expand the change.
- Every decision a reasonable implementer might reopen is recorded with its rationale.
- Every remaining choice is delegated with a rule. No open question is left unanswered.
- The change class, base branch, delivery endpoint, and release level are stated.
- A major change records its design and names the durable documents to update.
- The issue contains no secrets, private task metadata, or credentials.
