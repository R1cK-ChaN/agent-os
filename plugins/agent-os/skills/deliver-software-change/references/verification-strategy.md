# Verification strategy

Select the smallest sufficient evidence for the current change, then expand only when demonstrated risk requires it.

## Verification ladder

1. **Targeted static check:** syntax, format, schema, policy, contract, or type validation for the changed artifact.
2. **Targeted test:** the smallest executable example covering the changed behavior and its failure boundary.
3. **Affected module:** the owning package or subsystem suite when interactions inside that boundary may regress.
4. **Integration or smoke:** representative cross-boundary behavior when adapters, providers, persistence, deployment wiring, or end-to-end flow changed.
5. **Full suite:** repository-wide evidence when shared infrastructure, global contracts, build tooling, or broad regression risk justifies the cost.
6. **Staging:** enabled-path validation in an established isolated environment when runtime behavior or an external integration needs deployed evidence.

Start at the narrowest level capable of falsifying the expected behavior. Add the next level only for a concrete uncovered risk; do not execute every level mechanically.

Require scale, lock, concurrency, retry, migration, or production-grade validation only when that is the actual failure mode. Do not add feature flags, approval queues, release services, recurring gates, production rehearsals, or unconditional full-suite requirements merely to make ordinary work feel safer.

## Evidence

Report the command or check, observed result, and behavior it supports. When a relevant check is skipped, state why and name the residual risk. Never report an unavailable tool, missing service, or unauthorized environment as passing verification.
