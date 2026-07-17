# Workspace security

Protect sensitive state while preserving useful development evidence.

## Secret boundary

- Never expose secrets through command output, comments, logs, fixtures, or snapshots.
- Never commit environment files, OAuth state, cloud credentials, copied secret stores, or production-data extracts.
- Prefer cloud-side secret references, workload identity, emulators, and environment-scoped bindings over downloading production credentials for ordinary development.
- Keep test, staging, and production credentials, accounts, roles, endpoints, and data authority distinct. Availability in one environment does not authorize another.

Check a required secret by documented reference, provider metadata, or a non-sensitive presence/authentication probe. Do not print values, run a blanket environment dump, inspect credential payloads, or weaken redaction merely to prove readiness.

## Output and fixture safety

Redact sensitive request fields before logging. Keep logs focused on operation, correlation, and outcome rather than payloads. Use synthetic, minimal data in tests, fixtures, recordings, and snapshots; review generated artifacts before committing them.

Treat command lines as output surfaces: avoid embedding secret values in arguments, shell history, process listings, error messages, or copied diagnostics. Report only the missing reference, environment, and authorization action needed.

## Authority

Ordinary workspace inspection may establish presence without reading a value. Require explicit authority before rotating credentials, changing IAM or access control, downloading production secrets, accessing production data, or mutating external resources. A missing credential is a readiness blocker, not permission to create one.
