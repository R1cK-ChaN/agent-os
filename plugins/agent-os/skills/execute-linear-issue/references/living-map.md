# Living map protocol

Treat code and documentation as synchronized views of the current system. Use maps to route future work, not to replace code, tests, issues, or review.

Before editing, read the nearest repository `AGENTS.md`, any local `AGENTS.md` in a mapped subdirectory, and the contract header of a non-trivial source file when present.

After changing behavior, public interfaces, routes, schemas, persistence, provider usage, release gates, module responsibilities, data flow, or directory shape:

- Update an applicable file contract header.
- Update the nearest directory `AGENTS.md` when inventory or responsibility changed.
- Update the root map, README, or architecture document when project-level meaning changed.
- State why no map update was needed when the change affects behavior but no documentation should change.

Avoid documentation churn for typo-only, formatting-only, generated, lockfile-only, or fixture-only changes unless they alter system meaning.

Trust current code and verified behavior over stale documentation. Correct the map in the same slice when drift is discovered inside scope.
