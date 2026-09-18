# Release safety

Read this reference only for changes that affect deployment, external side effects, production users, release controls, or environment-specific behavior.

## Keep integration feedback proportional

Use an established staging environment when deployed evidence is relevant and authorized. Ordinary staging validation does not require production rollout machinery. Do not add a feature flag, manual gate, IAM permission, approval queue, canary system, or release service merely to test normal behavior.

Add a rollout control only when production needs gradual exposure, execution has unsafe or irreversible side effects, the repository already requires it, or the user explicitly requests it. Name the concrete failure it prevents, protected environment, clearing signal, owner, and removal or disable condition.

## Separate deployment from exposure

Treat deployment and production user exposure as different decisions. Preserve old behavior when a control is disabled, validate the enabled path proportionately, and keep a rollback or disable path for production-impacting changes.

Do not introduce a new feature-flag vendor or release system unless the repository already uses it or the user explicitly asks for it.
