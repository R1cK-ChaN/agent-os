# Design precedence and ownership

Apply design guidance in this order:

1. Current explicit user intent, within approved scope and authority.
2. The closest repository `AGENTS.md`, enforced contracts, public compatibility, tests, and tooling.
3. Repository-owned domain context, specifications, ADRs, schemas, and API definitions.
4. Existing code behavior when higher-priority sources do not intentionally change it.
5. Agent OS design defaults.

The plugin owns reusable judgment: how to examine names, domains, boundaries, persistence, interfaces, compatibility, and complexity.

The target repository owns project truth: canonical terms, business rules, bounded contexts, schemas, routes, framework choices, generated artifacts, and executable verification.

Do not copy project facts into the plugin. Do not make a global preference override an established repository convention merely for consistency with another project. When repository sources disagree, surface the conflict and resolve it in the repository before implementation.

Use an ADR only for a decision that is hard to reverse, surprising without context, and based on a real trade-off. Use domain context for vocabulary, specifications for required behavior, schemas or API definitions for machine contracts, and tests for executable examples.
