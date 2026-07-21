# Manual acceptance checklist

Use this checklist before a Plugin release or after changing a workflow boundary. Run it against a disposable repository or a real project where the requested actions are already authorized. Do not use production credentials or data.

## Sidecar bootstrap

- Run `node scripts/test_bootstrap.mjs` and confirm it passes.
- Bootstrap against both a clean disposable repository and one with staged, modified, and untracked state.
- Confirm HEAD, branch, index, worktree status, local Git configuration, hooks, and existing dirty state are unchanged.
- Confirm Agent OS writes only managed Skill copies under the external user Skill root.
- Point the Skill root through a symlink into the target `.git` directory and confirm bootstrap rejects it without mutation.
- Create a linked worktree, point the Skill root at its shared common Git directory, and confirm bootstrap rejects it without adding any `agent-os-*` entry.
- Configure `core.hooksPath` to an external directory, point the Skill root at that effective Hooks directory, and confirm bootstrap rejects it without adding any `agent-os-*` entry.
- Force or simulate a temporary-backup cleanup failure after final validation and confirm bootstrap retains the backup, reports a cleanup warning, and does not roll back committed Skill destinations.
- Start a new task and confirm `prepare-development-workspace` independently verifies durable state from the supplied repository and optional task identifier.

## Workspace recovery

- Start in a fresh or replaced environment with a remote branch or pull request.
- Invoke `prepare-development-workspace`.
- Confirm it loads workspace security before Git or provider inspection, recovers from durable remote state, follows the nearest repository instructions, and reports each required capability as available, unavailable, requires authorization, or unknown.
- Confirm it does not print raw remote credentials, secret values, or environment dumps.

## Project handbook

- Run `node scripts/test_handbook.mjs` and confirm it passes.
- Run `init-handbook` against an empty disposable Git repository and confirm it creates the starter documents and directories.
- Run it again and confirm it reports skips or equivalent existing paths without overwriting files.
- Run it with `--check-only` and confirm the target repository has no new files or Git changes.
- Add an existing `docs/architecture.md` and confirm initialization does not create a duplicate `docs/ARCHITECTURE.md`.
- Confirm `NOW.md` is treated as a current handoff and completed entries are removed rather than retained as history.
- Confirm handbook templates contain no private task identifiers, credentials, private URLs, or production data.
- Confirm the initialized handbook distinguishes normative intent, boundary contracts, and implementation evidence.
- Confirm a non-trivial sample requirement can name an interface or boundary and a falsifiable automated or manual verification path.

## Missing capability

- Reference one required tool that is not installed.
- Confirm workspace preparation reports the tool as unavailable or unknown, does not claim readiness, and asks before any installation that needs authorization.

## Checkpoint and resume

- Create a coherent non-sensitive change and a separate inconsistent or sensitive candidate.
- Confirm `checkpoint-development-work` can commit and push the coherent slice with an exact resume point, but refuses to persist the inconsistent or sensitive candidate as delivered.
- Resume in a fresh environment and confirm the remote branch and pull request are sufficient to find the next action.

## Privacy and authority

- Confirm private task identifiers, tracker URLs, secrets, and private decisions stay out of GitHub output.
- Confirm ordinary staging validation remains enabled without production rollout machinery.
- Confirm production deployment, user exposure, destructive actions, and external communication still require the applicable authority.

## Design and repository precedence

- Give `design-software-change` a repository with explicit naming, schema, API, or verification conventions.
- Confirm repository rules override Plugin defaults, concrete project facts remain in the repository, and the design avoids pass-through abstractions that hide no meaningful complexity.

## Record and automation threshold

Record the Plugin version, repository, scenario, result, and any observed failure in the owning issue without copying private task metadata to GitHub. Add an automated regression only after the same failure pattern has occurred in at least three real project uses or when a repository already requires that test.
