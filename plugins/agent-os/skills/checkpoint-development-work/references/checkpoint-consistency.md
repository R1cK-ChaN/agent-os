# Checkpoint consistency

Classify the complete candidate state, not individual files:

| State | Required evidence | Durable action |
| --- | --- | --- |
| `reviewable` | One coherent approved slice; synchronized code, tests, and maps; relevant verification passes | Commit, push, and create or update a draft pull request when useful |
| `recoverable-only` | One coherent and explainable phase; failed verification or an approved skipped check is recorded; the state is not represented as delivered | Commit and push when remote recovery is safer than local-only work; keep review status explicitly incomplete |
| `uncheckpointable` | Partial transformation, unrelated changes, secret or private-metadata risk, unexplained generated output, or state whose invariant cannot be explained | Do not commit; report the unpersisted risk and shrink or repair the slice |

A failed verification does not automatically make work inconsistent. It may be `recoverable-only` when the failure is reproducible, scoped, non-destructive, and clearly recorded. A passing test does not make unrelated or privacy-unsafe work reviewable.

Treat multiple issues on one branch as coherent only when an explicit approved override is recorded durably in the cumulative pull request and each included slice remains independently explainable. Otherwise use the repository's issue-scoped branch convention.

Before choosing a state, check normal behavior, partial failure, dirty generated files, missing tests, documentation drift, private metadata, secret exposure, and whether a fresh environment can identify the exact next action from remote state alone.
