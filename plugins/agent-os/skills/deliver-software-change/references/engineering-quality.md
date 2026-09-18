# Engineering quality

## Build from evidence

For executable behavior, prefer the smallest failing test or deterministic check that demonstrates the gap, then implement and simplify. Skip formal Red-Green-Refactor when a meaningful failing check cannot exist, such as mechanical formatting, generated artifacts, or low-risk documentation changes; use the narrowest deterministic validation instead.

Prefer concrete implementations before reusable abstractions. Abstract earlier only for a stable domain boundary, security invariant, provider boundary, or independently testable contract. After each slice, remove duplication and unnecessary code within scope.

## Verify proportionately

Run relevant tests and exercise the changed path. Inspect status and the screened diff before delivery. Do not run automated Codex review unless the user explicitly requests a review task.

Treat failed or unavailable verification honestly. Record the observed failure, residual risk, and next required evidence instead of reporting success.

## Keep delivery coherent

Do not mix unrelated user changes into a commit. Commit, push, or update a pull request at a coherent boundary when the requested delivery outcome needs durable remote state; do not create bookkeeping artifacts for their own sake.
