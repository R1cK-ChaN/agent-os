---
name: deliver-software-change
description: Implement, resume, or complete repository software changes with a lightweight default and stronger controls only when demonstrated risk requires them. Use for ordinary fixes and features, multi-file implementation, major changes that need documentation before code, verification, pull-request delivery, release preparation, or recovery from durable Git state. Do not require an external task tracker, a GitHub issue, a documentation baseline, or automated Codex review by default.
---

# Deliver a software change

Complete the requested change with the smallest process that safely fits it. The user's request and the target repository own scope; Agent OS supplies reusable delivery judgment.

## Workflow

1. Read [workspace-security.md](../prepare-development-workspace/references/workspace-security.md) before inspecting repository, Git, provider, log, fixture, credential, or external-service data.
2. Read the nearest repository instructions, relevant code, tests, contracts, scripts, and existing patterns. Preserve unrelated user work.
3. Classify the change:
   - **Ordinary:** localized and reversible, with no new durable contract, data ownership, authorization model, cross-system responsibility, or hard-to-reverse decision.
   - **Major:** changes canonical domain language or invariants; public APIs, events, or failure semantics; durable schemas, migrations, or data ownership; authorization or privacy; cross-module or cross-service responsibilities; external integrations or release behavior; a hard-to-reverse dependency or architecture choice; or spans phases that need shared recovery.
4. Do not require an issue. Use an existing issue when the user or repository supplies one, and create a new one only when explicitly requested or required by repository policy. Use the repository's naming conventions; otherwise title GitHub issues as `<scope>: <concise behavior change>`, use `feat/<slug>` or `fix/<slug>` for an isolated branch, and use `<scope>: <imperative summary>` for commit messages and pull-request titles.
5. For a major change, use `design-software-change`. When the repository has a handbook or equivalent durable specifications, use `project-handbook` to write the affected requirements, interfaces, architecture, or ADR before executable implementation. A semantically faithful documentation checkpoint does not need a second approval; stop only when it introduces unresolved meaning or an irreversible choice. Persist it separately only when shared review, recovery, or repository policy makes that useful.
6. For an ordinary change, do not create a pre-implementation documentation baseline. Add the smallest meaningful failing check when practical, implement the behavior, and refactor only where the evidence supports it. Read [engineering-quality.md](references/engineering-quality.md).
7. Read [verification-strategy.md](references/verification-strategy.md) and run the narrowest checks capable of falsifying the changed behavior. Expand verification only for a concrete uncovered risk.
8. Update durable documentation in the same change when observable behavior, a boundary contract, persistence, provider use, release controls, module responsibility, data flow, or directory shape actually changes. Read [living-map.md](references/living-map.md) only for those surfaces.
9. Read [database-change.md](references/database-change.md) for durable schema, persistent data, public API, or multi-version configuration changes. Read [release-safety.md](references/release-safety.md) for deployment, production exposure, external side effects, or environment-specific behavior.
10. Inspect status and the screened diff. Commit, push, open a pull request, or update a task record only when the user requests it, repository workflow requires it, or it is the normal delivery step for the requested outcome. Follow [implementation-lifecycle.md](references/implementation-lifecycle.md).
11. Read [authority-policy.md](references/authority-policy.md) before merge, production deployment or exposure, destructive actions, access-control changes, or external communication.

## Boundaries

- Do not introduce an external task tracker unless the user explicitly asks for it.
- Do not create an issue, separate documentation commit, remote checkpoint, pull request, feature flag, or release gate merely to satisfy this Skill.
- Do not run automated Codex review unless the user explicitly requests code review.
- Keep documentation proportional: ordinary implementation details belong in code and tests; durable behavior, contracts, responsibilities, and hard-to-reverse rationale belong in repository-owned documentation.
- Stop only for a material unresolved decision, missing authority or capability, unsafe state, required external wait, explicit user pause, or repository-required gate.

## Resume

Prefer the remote branch, existing pull request, and latest durable commit over chat history or stale local assumptions. Read only the task-relevant repository documentation and continue from the smallest safe next action.
