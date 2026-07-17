# Capability discovery

Discover only what the next approved slice needs. Repository evidence takes precedence over ecosystem guesses.

## Evidence order

1. Applicable repository instructions and executable contracts
2. Runtime and package-manager declarations, lockfiles, and tool-version files
3. Repository scripts, task runners, CI workflows, tests, fixtures, and smoke paths
4. Read-only tool and service probes
5. Explicit user or task authority

Do not treat a README example, installed binary, environment-variable name, or connector description as proof that a command works or an account is authorized.

## Discovery checklist

| Capability | Evidence to seek |
| --- | --- |
| Repository state | repository identity, remotes, default branch, working tree, remote branch, pull request, durable commit |
| Runtime | declared language and version, version manager files, locally available executable |
| Package manager | lockfile, declared manager/version, repository install command |
| Verification | repository test, lint, typecheck, build, integration, and smoke commands |
| Supporting services | documented service, fixture, container, emulator, endpoint, or health check |
| External tools | required CLI or connector plus a non-sensitive authorization probe when available |
| Secrets | documented secret reference or presence check without reading the value |

Run the narrowest safe probe that can establish the next fact. A failed probe is evidence for `unavailable` only when it actually tests the required capability; otherwise classify the result as `unknown` and explain what evidence is missing.

Never run a blanket environment dump, print credential files, echo tokens, download ordinary production credentials, mutate cloud resources, or contact production merely to prove readiness.
