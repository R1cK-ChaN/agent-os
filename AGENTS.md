# Agent OS repository map

This repository distributes a private, installable Agent OS workflow. It contains reusable cross-project delivery and design methods, not project-specific product knowledge or credentials.

## Source of truth

- `plugins/agent-os/` owns the installable plugin and reusable skills.
- `plugins/agent-os/skills/prepare-development-workspace/` owns evidence-based workspace readiness, VM secret safety, and durable recovery orientation.
- `plugins/agent-os/skills/checkpoint-development-work/` owns coherent remote checkpoints and pause/resume evidence.
- `plugins/agent-os/skills/execute-linear-issue/references/verification-strategy.md` owns risk-scaled verification depth.
- `.agents/plugins/marketplace.json` exposes the plugin from this Git repository.
- `docs/architecture.md` records system boundaries, lifecycle, and directory responsibilities.
- `docs/manual-acceptance.md` owns the small, human-run workflow acceptance checklist.
- A target repository owns its code, domain language, business rules, schemas, API contracts, framework conventions, specifications, verification commands, and local `AGENTS.md` guidance.
- Linear owns private task state and completion evidence. GitHub owns implementation history.

## Working rules

- Read the approved Linear task first, then the applicable GitHub issue and repository guidance.
- Keep task linkage one-way: Linear may point to GitHub; GitHub must not contain private Linear task identifiers, URLs, or checkpoints.
- Use `feat/issue-<github-number>-<slug>` or `fix/issue-<github-number>-<slug>` unless a target repository defines a more specific convention.
- Default to one GitHub issue per branch; get user approval before combining multiple issues.
- Use scope-first imperative commit and pull-request titles.
- Use `gh` as the primary GitHub interface.
- Never commit credentials, OAuth state, environment files, or invented connector identifiers.
- Keep ordinary staging integration enabled and fast. Add release gates only for a concrete risk, an existing repository requirement, or an explicit user request.
- Apply the design Skill before implementing changes to domain language, invariants, module boundaries, public interfaces, persistent data, or architecture. Keep reusable judgment in the plugin and concrete project truth in the target repository.

## Verification

Run all checks before committing:

```bash
python3 scripts/verify_privacy.py
git diff --check
```

Run the official Skill and Plugin validators from their discovered locations, and require the repository's GitGuardian check. Do not hardcode a user-home path into portable repository automation.

Run `codex exec review --uncommitted` before the implementation commit and fix only material findings. Update this map and `docs/architecture.md` when directory responsibilities, workflow boundaries, or external-system ownership changes.
