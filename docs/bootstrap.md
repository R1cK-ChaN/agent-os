# Sidecar bootstrap

Agent OS bootstrap activates personal development workflows in a replaceable Codex environment without adding Agent OS files or configuration to the target project.

## Fresh Work environment

Agent OS uses an intentionally public distribution repository, as recorded in [ADR 0001](decisions/0001-public-distribution.md), so a fresh environment can acquire a pinned release without Git credentials:

```bash
git clone --depth 1 --branch <release-tag> https://github.com/R1cK-ChaN/agent-os.git /tmp/agent-os
node /tmp/agent-os/scripts/agent-os.mjs bootstrap --target /absolute/project/path
```

Pin a release tag or reviewed commit for routine use. Do not silently execute an unreviewed moving `main` branch.

After activation, start a new Codex task so Skill discovery runs again, then provide the target repository and optional task identifier:

```text
Use prepare-development-workspace to recover owner/repository and task TEAM-123.
Verify durable GitHub and task state, report missing authorization, and identify the safe next entry point.
```

## Contract

Bootstrap writes only to the user Skill directory. It snapshots the target repository before activation and again after every write, failing and rolling back installed Skill changes if HEAD, branch, index, working-tree status, shared or worktree-local Git configuration, or the effective Hooks directory changes. Existing dirty state is preserved exactly. For linked worktrees, both the worktree Git directory and shared common Git directory are protected. Hooks protection follows `git rev-parse --git-path hooks`, including an external `core.hooksPath`.

The Skill transaction commits after the final repository snapshot passes. Temporary-backup cleanup happens afterward; a cleanup failure retains the backup and returns a warning, but never deletes the newly activated Skills or attempts an unsafe second rollback.

The CLI stores no installation ledger, repository remote, credential, recovery handoff, or project report. GitHub and the approved task tracker remain the durable sources of truth. ChatGPT connector authorization remains separate from anonymous Agent OS source acquisition.

## Commands

```bash
node scripts/agent-os.mjs bootstrap --target /absolute/project/path
node scripts/agent-os.mjs bootstrap --target /absolute/project/path --check-only
node scripts/agent-os.mjs doctor --target /absolute/project/path
```

Use `--skills-home` only for an external user Skill directory. Bootstrap resolves symlinks and refuses any Skill root that lands inside the target worktree, its worktree-specific Git directory, its shared common Git directory, or its effective Hooks directory.

## Idempotency and updates

Skills are copied atomically to `$HOME/.agents/skills/agent-os-*`. Each managed copy contains a small ownership marker. An identical destination is skipped. A changed destination is updated only when its marker identifies the same Agent OS Skill; unknown directories, files, and symlinks are refused.

The first release deliberately omits automatic source updates, account-level Plugin installation, persistent backups, status records, handoffs, and recursive uninstall. Update the reviewed Agent OS checkout, validate it, and rerun bootstrap to refresh managed copies.
