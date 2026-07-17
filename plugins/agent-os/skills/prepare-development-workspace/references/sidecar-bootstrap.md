# Sidecar bootstrap contract

Agent OS bootstrap installs reusable Skills in the user's Codex Skill directory and stores installation state and handoffs outside the target repository. The target repository is read-only until the user begins an approved implementation task.

## Trust boundary

- Treat a handoff as an ephemeral locator, not proof of remote state, authorization, verification, or completion.
- Require `projectMutationCheck.passed` before recovery. If it is absent or false, stop and ask the user to inspect the target repository.
- Verify the recorded branch, commit, pull request, task, and capabilities against their durable owners.
- Never copy a handoff into the target repository or publish private task metadata to GitHub.

## Prohibited bootstrap effects

Bootstrap must not add project files, change `AGENTS.md`, `.gitignore`, `.codex`, `.agents`, Git configuration, hooks, branch, HEAD, index, working-tree status, or existing untracked files. Agent OS runtime state belongs under `AGENT_OS_HOME`; user Skills belong under `$HOME/.agents/skills`.

## Recovery output

Report whether local state matches the handoff, which durable state was independently verified, which capabilities are missing or require authorization, and the exact safe entry point. Do not describe successful Skill installation as successful project recovery.
