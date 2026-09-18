# Project handbook

This is the map for the project's durable shared documentation. It should help a new person or Agent understand what the project does, its boundaries, and why durable choices were made.

## Read first

1. [README](../README.md)
2. [AGENTS](../AGENTS.md)
3. [Requirements](REQUIREMENTS.md)
4. [Interfaces](INTERFACES.md)
5. [Architecture](ARCHITECTURE.md)
6. [Decisions](decisions/README.md)

## Fact precedence

- Accepted requirements and ADRs are normative intent: they describe what the project should do and why.
- Human-readable interfaces and their owning schemas, types, or specifications are boundary contracts.
- Code, tests, static checks, and recorded manual checks are implementation evidence: they show current behavior but do not authorize new intent by themselves.
- Issues, pull requests, chats, and personal notes provide context but are not the sole home of durable decisions.
- Task progress, blockers, and session recovery details stay outside tracked handbook files.

Ordinary fixes, localized features, and internal refactors do not require a pre-implementation documentation baseline. Update the handbook alongside code only when system meaning changes.

Before a major change, record affected public contracts, persistence, authorization, cross-system responsibilities, or hard-to-reverse architecture in the owning document. Resolve material semantic gaps before code. A separate documentation checkpoint is optional and should exist only for useful shared review, recovery, or repository policy.

When sources conflict, preserve the evidence and classify the discrepancy as a specification defect, implementation defect, verification defect, or unrecorded intent change before correcting the owning layer.

## Update map

| Change | Update |
| --- | --- |
| Required behavior | `REQUIREMENTS.md` |
| Module or data-flow responsibility | `ARCHITECTURE.md` |
| Cross-boundary contract | `INTERFACES.md` and its machine-readable source |
| Hard-to-reverse trade-off | A new ADR in `decisions/` |
| Operator procedure | A runbook in `runbooks/` |
