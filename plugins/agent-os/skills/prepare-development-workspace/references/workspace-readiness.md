# Workspace Readiness result

Return a concise, ephemeral result with these fields:

- **Recovery state:** repository, default branch, current durable branch or pull request, and whether local state diverges.
- **Capabilities:** each required runtime, package manager, verification path, tool, service, or authorization with one status: `available`, `unavailable`, `requires authorization`, or `unknown`.
- **Evidence:** the non-sensitive observation supporting each status.
- **Blockers:** only facts that prevent the next approved slice, including the action or authority needed to clear them.
- **Next entry point:** the exact durable branch, pull request, file, command, or approved action from which work can safely continue.

Do not include secret values, environment dumps, copied credentials, private task metadata in repository-facing output, or speculative installation instructions.

If everything required is available, say so and name the next entry point. If readiness is partial, preserve the usable evidence and distinguish unavailable capabilities from unknown ones rather than collapsing both into a generic failure.
