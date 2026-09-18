# Living map protocol

Treat code and documentation as synchronized views of current system meaning, without turning documentation into a mirror of every implementation detail.

After changing observable behavior, public interfaces, routes, schemas, persistence, provider usage, release controls, module responsibilities, data flow, or directory shape, update the existing document that owns that meaning. Use repository equivalents instead of creating duplicate maps.

Do not update durable documentation for typo-only, formatting-only, generated, lockfile-only, fixture-only, or internal refactoring changes unless they alter system meaning.

When documentation and verified behavior disagree, preserve the conflict long enough to determine whether the defect is in the specification, implementation, verification, or an unrecorded intent change. Correct the owning layer rather than silently rewriting intent to match accidental behavior.
