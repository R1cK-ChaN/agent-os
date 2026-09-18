# ADR 0006: Adopt risk-scaled delivery

- Status: Accepted
- Date: 2026-09-18
- Supersedes: ADR 0002, ADR 0003, and their documentation-baseline requirements in ADR 0004 and ADR 0005

## Context

The original workflow required Linear, a GitHub issue, an issue-numbered branch, a separately persisted documentation baseline, and automated Codex review for every non-trivial implementation. This protected long-running private work but imposed the same ceremony on ordinary bugs, localized features, and internal refactors.

File count and a broad `non-trivial` label did not reliably measure semantic or operational risk. The workflow also duplicated task state across systems and made documentation bookkeeping a prerequisite for code even when no durable contract changed.

## Decision

Agent OS uses a lightweight default and escalates process only for demonstrated risk.

- Linear and GitHub issues are optional integrations, never default prerequisites.
- Ordinary changes do not require a pre-implementation documentation baseline or automated Codex review.
- Major changes document affected durable meaning before executable implementation when they change public contracts, persistence, authorization, cross-system responsibility, release behavior, or hard-to-reverse architecture.
- A separate documentation commit or remote checkpoint is optional and exists only for useful shared review, recovery, or repository policy.
- Verification starts with the narrowest check capable of falsifying the changed behavior and expands for concrete risk.
- Checkpoints are reserved for meaningful interruption risk and do not pause otherwise authorized work.

## Consequences

- Daily implementation has fewer mandatory artifacts and external dependencies.
- Major changes retain documentation-first design where it prevents ambiguity and expensive rework.
- Repositories may still require issues, reviews, handbooks, or gates through closer instructions.
- Existing historical ADRs remain for context, but this decision owns the current delivery policy.

## Verification

- Confirm ordinary changes can proceed without an issue or documentation baseline.
- Confirm major contract, data, authorization, and architecture changes route through design and repository-owned documentation before code.
- Confirm no current Skill requires Linear or automated Codex review.
- Confirm checkpoint, release, and authority boundaries remain intact.
