# Release safety without staging drag

Read this reference only for changes that affect deployment, external side effects, production users, release controls, or environment-specific behavior.

## Optimize staging for integration feedback

Staging is the default enabled integration environment for a merged feature. Use environment isolation as the normal safeguard and validate the enabled path as soon as practical.

A normal staging validation does not require production rollout machinery. Do not add a feature flag, manual gate, IAM permission, one-off workflow, approval queue, canary system, or new release service merely to test ordinary behavior in staging.

Do not wait for provider certification, a recurring validation fixture, a downstream repository, or production-grade operational proof before beginning normal staging integration unless the approved issue identifies it as a real dependency. A fixture or smoke tool helps verification; it is not automatically a release gate.

Keep staging disabled only for a concrete recorded exception such as destructive or irreversible effects, unsafe external communication, uncontrolled cost, missing required dependency, shared sensitive data, or an explicitly approved staged rollout.

## Justify every added gate

Add a rollout control only when at least one condition is true:

- Production needs gradual, internal-only, or canary exposure.
- Execution has unsafe, costly, irreversible, or externally visible side effects.
- The repository already requires the control.
- The user explicitly requests it.

For every new gate, name the concrete failure it prevents, the environment it protects, the owner, the validation that clears it, and the removal or disable condition. If these cannot be stated, do not add the gate.

## Separate deployment from exposure

Treat deployment and production user exposure as different decisions:

1. Merge compatible code.
2. When an approved repository workflow pre-authorizes staging deployment or explicit approval exists, deploy to staging with the new path enabled.
3. Run the smallest representative staging smoke.
4. Prepare production deployment without inferring full user exposure.
5. Enable production exposure only from an explicit validation signal or established release command.

When a real production control exists, preserve old behavior while disabled, test disabled and enabled paths when practical, document post-deploy validation, and keep a rollback or disable path.

Do not introduce a new feature-flag vendor or release system unless the repository already uses it or the user explicitly asks for it.
