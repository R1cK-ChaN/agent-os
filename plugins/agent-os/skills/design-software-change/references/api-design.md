# API design

Treat every callable boundary as an interface cost, including functions, modules, HTTP or RPC endpoints, events, commands, SDKs, and provider adapters. The target repository owns the concrete contract.

## Design the contract

- Express domain intent and outcomes; do not expose storage tables, provider payloads, or internal orchestration without need.
- Keep required caller knowledge small: minimize sequencing, configuration, representation coupling, and special cases.
- Define request validation, authorization, side effects, consistency, and response semantics at the boundary.
- Give retryable operations an explicit idempotency contract and define duplicate-request behavior.
- Define stable error semantics: category, machine-readable code, safe message, retryability, and mapping from internal or provider failures.
- Use pagination with stable ordering and cursor semantics for unbounded collections.
- Define concurrency behavior with versions, preconditions, or conflict results when stale writes matter.
- Evolve published contracts additively by default; specify deprecation and compatibility when removal or semantic change is approved.
- Keep authentication, authorization, tenant isolation, rate or cost limits, and sensitive-field handling explicit.
- Provide correlation and outcome observability without leaking secrets or private payloads.

Prefer coarse domain operations that protect invariants over chatty CRUD when callers would otherwise reproduce policy. Do not combine unrelated operations merely to reduce endpoint count.

Test success, validation, authorization, idempotency, retries, conflicts, partial provider failure, pagination boundaries, compatibility, and error mapping. Maintain the repository's machine-readable specification or contract tests when present.
