# Agent OS repository map

This public repository distributes an installable, risk-scaled Agent OS workflow for personal development. It contains reusable cross-project methods, not project-specific facts or credentials.

## Source of truth

- `plugins/agent-os/` owns the installable plugin and reusable skills.
- `plugins/agent-os/skills/deliver-software-change/` owns lightweight delivery, conditional documentation-first work, verification, authority, and release guidance.
- `plugins/agent-os/skills/prepare-development-workspace/` owns evidence-based workspace readiness, secret safety, and durable recovery orientation.
- `plugins/agent-os/skills/checkpoint-development-work/` owns coherent remote checkpoints before interruption risk.
- `plugins/agent-os/skills/project-handbook/` owns the optional repository handbook, major-change documentation contract, and templates.
- `plugins/agent-os/skills/design-software-change/` owns reusable design questions; target repositories own the answers.
- `.agents/plugins/marketplace.json` exposes the plugin from this Git repository.
- `docs/architecture.md` records current system boundaries and lifecycle.
- `docs/decisions/` records hard-to-reverse workflow decisions.
- `docs/manual-acceptance.md` owns the human-run acceptance checklist.
- `docs/bootstrap.md` and `scripts/agent-os.mjs` own project-external activation and handbook initialization.
- A target repository owns its code, domain language, business rules, schemas, API contracts, specifications, verification commands, and local `AGENTS.md` guidance.

## Working rules

- Treat the user's current request and the closest target-repository instructions as scope. Do not require Linear or a GitHub issue.
- Use an existing issue when one is supplied. Create a new issue only when explicitly requested or required by repository policy.
- Follow repository branch conventions. When isolation is useful and none exists, prefer `feat/<slug>` or `fix/<slug>`.
- Use scope-first imperative commit and pull-request titles when no closer convention applies.
- Never commit credentials, OAuth state, environment files, private task metadata, or copied production data.
- Ordinary fixes, localized features, and internal refactors do not require a pre-implementation documentation baseline.
- Before a major change, document affected public contracts, durable data, authorization, cross-system responsibilities, or hard-to-reverse architecture in the owning repository document. A separate documentation checkpoint is optional and exists only for useful shared review, recovery, or repository policy.
- Update durable documentation with code when observable behavior, interfaces, schemas, persistence, provider use, release controls, responsibilities, data flow, or directory shape changes. Avoid documentation churn for implementation-only details.
- Use meaningful Red-Green-Refactor checks when practical and select the smallest verification sufficient for demonstrated risk.
- Do not run automated Codex review unless the user explicitly requests code review.
- Checkpoint only at a coherent phase when interruption, environment replacement, or external waiting creates real recovery risk. A checkpoint does not pause authorized work.
- Apply the design Skill before changes to domain language, invariants, module boundaries, public interfaces, persistent data, authorization, or architecture.
- Keep staging fast and use it only when deployed evidence is relevant. Preserve explicit authority for merge, production exposure, destructive actions, access-control changes, and external communication.

## Verification

Run the checks relevant to the changed surface. Before a plugin release, run:

```bash
python3 scripts/verify_privacy.py
node scripts/test_bootstrap.mjs
node scripts/test_handbook.mjs
git diff --check
```

Run official Skill and Plugin validators from their discovered locations. Update this map and `docs/architecture.md` when workflow boundaries or directory responsibilities change.
