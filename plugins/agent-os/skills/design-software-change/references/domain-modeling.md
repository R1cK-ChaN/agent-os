# Domain modeling

Build the model from language, behavior, and ownership rather than tables, screens, or framework classes.

## Resolve the model

- Define the bounded context in which each term has one meaning. Use a context map only when multiple contexts and translations actually exist.
- Identify entities by durable identity and lifecycle; identify value objects by attributes, equality, and invariants.
- State invariants in testable language and place enforcement with the domain or data owner that has enough information.
- Model state transitions as allowed domain behavior, including actor, preconditions, effects, rejected transitions, and emitted evidence.
- Separate commands that request change, facts or events that record what happened, and projections that serve reads when the distinction reduces ambiguity.
- Assign one authoritative owner for mutable data and define translations at context or provider boundaries.

Stress-test with duplicate requests, retries, stale state, partial failure, concurrent actors, authorization boundaries, correction, cancellation, and historical reconstruction when relevant.

Record concrete vocabulary and definitions in the target repository's established domain context file. Keep that glossary free of implementation details. Record a hard-to-reverse architectural trade-off in an ADR only when repository conventions support it.

Do not create entities, repositories, services, events, or bounded contexts merely because a pattern catalog names them. Each construct must clarify language, protect invariants, establish ownership, or reduce change amplification.
