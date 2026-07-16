# Database and compatibility changes

Read this reference only when changing a durable database schema, persistent data, public API, or configuration consumed by multiple deployed versions.

## Choose compatibility by deployment reality

Use expand-and-contract by default when old and new application versions may run concurrently or when independent consumers cannot upgrade atomically:

1. Expand with an additive compatible schema or API.
2. Deploy code that tolerates old and new representations.
3. Backfill or migrate data with bounded, observable work.
4. Switch reads and writes after verification.
5. Remove the old shape in a later approved change.

Do not force expand-and-contract onto a disposable environment, an unreleased project, a coordinated maintenance window, or an explicitly approved atomic migration when no mixed-version compatibility exists. Record the reason for the simpler path.

Avoid destructive or long-lock production migrations without an explicit plan. Define backup or recovery, post-deploy verification, rollback or forward-fix, and the effect on current clients.

Use staging to exercise the real migration path promptly. Do not block staging on a production-scale rehearsal unless scale or locking behavior is the risk being tested.
