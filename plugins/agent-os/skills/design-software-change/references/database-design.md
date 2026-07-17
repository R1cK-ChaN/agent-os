# Database design

Design persistence from invariants, access patterns, lifecycle, and data ownership. The target repository owns the concrete schema and migrations.

## Model durable truth

- Choose stable identifiers deliberately; distinguish internal keys from externally meaningful identifiers when needed.
- Express required invariants with database constraints when the database has enough information: `NOT NULL`, uniqueness, checks, foreign keys, and exclusion rules.
- Give nullability one explicit meaning. Do not use `NULL`, empty values, and sentinel values interchangeably.
- Model cardinality, ownership, deletion behavior, and historical retention explicitly.
- Normalize durable truth by default; denormalize for a measured read need with a named refresh or consistency contract.
- Define transaction boundaries around invariants, not controller or request-file boundaries.
- Design idempotency and concurrency control for retried or competing writes.
- Derive indexes from real query and constraint needs; account for selectivity, write cost, ordering, and production data size.
- Use precise types for money, time, units, and bounded values. Define timezone and clock semantics.
- Preserve audit evidence required by the domain without treating mutable timestamps as a complete audit log.
- Align access control, row-level policy, encryption, retention, and least privilege with data ownership and sensitivity.

Separate logical database design from rollout mechanics. Use the repository's compatibility and migration policy for expand-and-contract, backfills, locks, verification, and rollback. Do not add production-scale staging gates unless scale or locking is the concrete risk.

Validate constraints, representative queries, transaction failure, retry behavior, authorization, migration compatibility, and recovery. Avoid generic entity tables, schemaless escape hatches, and duplicated sources of truth unless an approved requirement justifies them.
