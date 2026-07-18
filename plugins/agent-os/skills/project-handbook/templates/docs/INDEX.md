# Project handbook

This is the map for the project's shared working set. It should help a new person or Agent answer what the project does, why it is shaped this way, where it stands, and what to do next.

## Read first

1. [README](../README.md)
2. [AGENTS](../AGENTS.md)
3. [Current work and handoff](NOW.md)
4. [Requirements](REQUIREMENTS.md)
5. [Interfaces](INTERFACES.md)
6. [Architecture](ARCHITECTURE.md)
7. [Decisions](decisions/README.md)

## Fact precedence

- Code and automated tests describe current observed behavior.
- Accepted requirements and ADRs describe intended behavior and design decisions.
- Interface schemas and generated specifications define machine-readable boundary contracts.
- `NOW.md` describes the current execution handoff, not historical truth.
- Issues, pull requests, meetings, chats, and personal notes provide context but are not the sole home of a durable decision.

When sources conflict, preserve the evidence, record the discrepancy, and make the correction explicit.

## Update map

| Change | Update |
| --- | --- |
| Required behavior | `REQUIREMENTS.md` |
| Current task, blocker, or handoff | `NOW.md` |
| Module or data-flow responsibility | `ARCHITECTURE.md` |
| Cross-boundary contract | `INTERFACES.md` and its machine-readable source |
| Hard-to-reverse trade-off | A new ADR in `decisions/` |
| Operator procedure | A runbook in `runbooks/` |
