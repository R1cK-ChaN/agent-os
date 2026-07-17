# ADR 0001: Public distribution, private workflow data

- Status: Accepted
- Date: 2026-07-17

## Context

Replaceable Codex environments need a deterministic way to acquire Agent OS without depending on a previous machine or Git credential. The repository contains reusable workflow methods and must not contain project code, secrets, private Linear identifiers, private decisions, credentials, or production data.

## Decision

The repository `R1cK-ChaN/agent-os` is intentionally public and is the distribution source for Agent OS. Fresh environments may anonymously clone a pinned release tag or reviewed commit.

“Private” in workflow documentation describes the confidentiality of task and project data, not repository visibility. Linear remains the source of truth for private task state, and target repositories remain the source of truth for project-specific code and decisions. Neither category of private data may be copied into Agent OS.

## Consequences

- Public acquisition requires no GitHub credential.
- Consumers must pin a reviewed release or commit rather than silently executing a moving branch.
- Privacy scans and GitGuardian remain required because every committed file is publicly visible.
- If private workflow data is ever required for distribution, it must live in a separately authorized private system; changing this repository to private is not an implicit data-migration strategy.
