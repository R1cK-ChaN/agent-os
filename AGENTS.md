# Agent OS repository map

This repository distributes a private, installable Agent OS workflow. It contains reusable cross-project process, not project-specific product knowledge or credentials.

## Source of truth

- `plugins/agent-os/` owns the installable plugin and reusable skills.
- `.agents/plugins/marketplace.json` exposes the plugin from this Git repository.
- `docs/architecture.md` records system boundaries, lifecycle, and directory responsibilities.
- A target repository owns its code, specifications, verification commands, and local `AGENTS.md` guidance.
- Linear owns private task state and completion evidence. GitHub owns implementation history.

## Working rules

- Read the approved Linear task first, then the applicable GitHub issue and repository guidance.
- Keep task linkage one-way: Linear may point to GitHub; GitHub must not contain private Linear task identifiers, URLs, or checkpoints.
- Use `feat/issue-<github-number>-<slug>` or `fix/issue-<github-number>-<slug>` unless a target repository defines a more specific convention.
- Use scope-first imperative commit and pull-request titles.
- Use `gh` as the primary GitHub interface.
- Never commit credentials, OAuth state, environment files, or invented connector identifiers.

## Verification

Run all checks before committing:

```bash
python3 scripts/verify_architecture.py
python3 /home/rick/.codex/skills/.system/skill-creator/scripts/quick_validate.py plugins/agent-os/skills/execute-linear-issue
python3 /home/rick/.codex/skills/.system/plugin-creator/scripts/validate_plugin.py plugins/agent-os
```

Run `codex exec review --uncommitted` before the implementation commit and fix only material findings. Update this map and `docs/architecture.md` when directory responsibilities, workflow boundaries, or external-system ownership changes.
