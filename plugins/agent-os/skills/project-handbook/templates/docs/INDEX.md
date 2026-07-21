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

- Accepted requirements and ADRs are the normative intent: they describe what the project should do and why.
- Human-readable interfaces and their owning schemas, types, or specifications are the boundary contracts.
- Code, automated tests, static checks, and recorded manual checks are implementation evidence: they describe or test current observed behavior but do not authorize intended behavior by themselves.
- `NOW.md` describes the current execution handoff, not historical truth.
- Issues, pull requests, meetings, chats, and personal notes provide context but are not the sole home of a durable decision.

For each non-trivial slice, identify the normative inputs, implementation outputs or boundaries, and falsifiable verification evidence. Traceability helps find missing coverage; it is not proof that generated code is semantically correct.

When sources conflict, preserve the evidence and classify the discrepancy as a specification defect, implementation defect, verification defect, or unrecorded intent change before correcting the owning layer.

## Update map

| Change | Update |
| --- | --- |
| Required behavior | `REQUIREMENTS.md` |
| Current task, blocker, or handoff | `NOW.md` |
| Module or data-flow responsibility | `ARCHITECTURE.md` |
| Cross-boundary contract | `INTERFACES.md` and its machine-readable source |
| Hard-to-reverse trade-off | A new ADR in `decisions/` |
| Operator procedure | A runbook in `runbooks/` |
