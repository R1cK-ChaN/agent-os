# ADR 0005: Keep execution handoffs out of tracked project documentation

- Status: Accepted
- Date: 2026-08-06
- Issue: #20
- Supersedes: ADR 0002 only where it assigns the current handoff to `NOW.md`

## Context

Agent OS currently scaffolds `docs/NOW.md` and requires handbook, workspace,
checkpoint, and delivery workflows to read and update it. The file owns mutable
branch-local execution state rather than durable project meaning.

Concurrent branches therefore rewrite the same tracked singleton, causing merge
conflicts and exposing task-, session-, user-, or Agent-specific context to
unrelated contributors. The recovery goal remains valid, but repository history
already has conflict-free owners for shared task state: GitHub issues, pull
requests, remote branches, and commits.

## Decision

The repository-owned project handbook contains durable project-wide meaning:
requirements, interfaces, architecture, decisions, runbooks, and curated
references. Agent OS does not create, require, read, or update a tracked
`NOW.md` or equivalent mutable handoff file by default.

GitHub issues and pull requests own shared task scope, progress, blockers,
verification evidence, and exact resume conditions. Private checkpoints may
supplement session-local recovery, but remain outside tracked target-repository
files and are not normative project truth.

A closer target-repository instruction may explicitly retain its own handoff
convention. Agent OS respects that convention without scaffolding it as a
portable default. Existing target repositories and tracked `NOW.md` files are
not deleted or rewritten automatically.

The documentation-first baseline remains required. It compiles approved intent
only into affected durable owning documents and records its commit and progress
on the GitHub issue before executable implementation.

## Alternatives considered

### Keep `docs/NOW.md` but reduce its content

Even minimal branch-local content makes concurrent branches contend for the
same tracked file and exposes unrelated execution context.

### Move the default to an ignored path in every target repository

This avoids Git conflicts but still mutates target repositories with a personal
state convention, ignore rules, or directories they did not request.

### Store all project meaning only in issues and pull requests

Issues and pull requests are appropriate execution records but poor canonical
owners for durable requirements, interfaces, architecture, and design
rationale. The handbook continues to own those stable views.

## Consequences

- New handbook initialization no longer creates `docs/NOW.md`.
- Independent branches stop conflicting on a default mutable handoff file.
- Shared execution recovery uses the GitHub issue, pull request, branch, and
  commits.
- Session-local recovery details stay private and disposable.
- Skills, templates, initialization, tests, architecture, and manual acceptance
  must use consistent ownership language.
- Existing repositories may keep an explicit local handoff convention without
  automatic migration.

## Compatibility and migration

The change applies prospectively after the updated plugin is installed. It does
not delete existing files, add ignore rules, or create private directories in
target repositories. A closer repository `AGENTS.md` or established workflow
remains authoritative.

## Verification

- Confirm `init-handbook` does not create `docs/NOW.md`.
- Confirm handbook templates and Agent OS skills do not require a tracked
  handoff file by default.
- Confirm workflow guidance routes shared task state to the GitHub issue or pull
  request and private recovery context outside tracked project files.
- Confirm repository-wide searches leave only compatibility or historical ADR
  references to `NOW.md`.
- Run handbook, bootstrap, privacy, formatting, Skill, and Plugin validation.
