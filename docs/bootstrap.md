# Sidecar bootstrap

Agent OS bootstrap activates personal development workflows in a replaceable Codex environment without adding Agent OS files or configuration to the target project.

## Contract

Bootstrap writes only to the user Skill directory and `AGENT_OS_HOME`. It snapshots the target repository before and after activation and fails if HEAD, branch, index, working-tree status, local Git configuration, or hooks change. Existing dirty state is preserved exactly.

The deterministic CLI cannot call ChatGPT connectors or MCP tools. It creates an external handoff; a new Codex task then uses `prepare-development-workspace` to verify GitHub, Linear, and other capabilities and reconstruct durable state.

## Commands

```bash
node scripts/agent-os.mjs bootstrap --target /absolute/project/path
node scripts/agent-os.mjs bootstrap --target /absolute/project/path --issue TEAM-123
node scripts/agent-os.mjs doctor --target /absolute/project/path
node scripts/agent-os.mjs status
node scripts/agent-os.mjs uninstall
```

Use `--check-only` to validate without installing. Use `--agent-os-home` and `--skills-home` for disposable test environments. Do not point either option inside the target project.

## Installation locations

- User Skills: `$HOME/.agents/skills/agent-os-*`
- Installation lock: `$AGENT_OS_HOME/installation.json`
- Recovery handoffs: `$AGENT_OS_HOME/handoffs/`
- Temporary backups: `$AGENT_OS_HOME/backups/`

Skills are copied atomically for Windows, macOS, and Linux portability. Agent OS records every managed destination and refuses to overwrite an unrelated Skill with the same frontmatter name. Uninstall removes only recorded Agent OS content and refuses to delete locally modified managed Skills unless `--force` is explicit.

## Private repository acquisition

Bootstrap starts after the Agent OS source is available. GitHub connector authorization does not imply Git CLI authentication and the script never asks for or stores a token. Open the private repository through an authorized Work/GitHub flow or authenticate Git separately using the platform's supported mechanism.

## Handoff

The handoff contains paths, sanitized repository identity, branch, commit, dirty-state boolean, optional task identifier, required capability names, installed Skill names, and the zero-mutation result. It contains no file contents, environment values, tokens, cookies, database credentials, or production data.

After bootstrap, start a new Codex task so Skill discovery runs again, then ask:

```text
Use prepare-development-workspace to recover from the latest Agent OS handoff.
Verify durable GitHub and task state, report missing authorization, and identify the safe next entry point.
```

## Update boundary

The first release deliberately omits automatic source updates and Plugin-account installation. Update the Agent OS checkout through its approved Git workflow, validate it, then rerun bootstrap to atomically refresh managed user Skills.
