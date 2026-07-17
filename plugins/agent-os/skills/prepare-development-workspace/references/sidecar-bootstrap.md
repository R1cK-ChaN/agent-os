# Sidecar bootstrap contract

Agent OS bootstrap copies reusable Skills from the public Agent OS repository into the user's Codex Skill directory. It stores no installation ledger, remote URL, credential, or recovery handoff. The target repository is read-only until the user begins an approved implementation task.

## Trust boundary

- Treat successful Skill activation as an environment capability, not proof of repository state, authorization, verification, or completion.
- Resolve the target repository and optional task identifier from the user request, then verify branch, commit, pull request, task, and capabilities against their durable owners.
- Never infer project state from the Agent OS checkout or publish private task metadata to GitHub.

## Prohibited bootstrap effects

Bootstrap must not add project files, change `AGENTS.md`, `.gitignore`, `.codex`, `.agents`, Git configuration, hooks, branch, HEAD, index, working-tree status, or existing untracked files. User Skills belong under `$HOME/.agents/skills` or an explicitly supplied external Skill root.

## Recovery output

Report which durable state was independently verified, which capabilities are missing or require authorization, and the exact safe entry point. Do not describe successful Skill activation as successful project recovery.
