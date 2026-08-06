# Project handbook

This is the map for the project's durable shared documentation. It should help a new person or Agent answer what the project does and why it is shaped this way.

## Read first

1. [README](../README.md)
2. [AGENTS](../AGENTS.md)
3. [Requirements](REQUIREMENTS.md)
4. [Interfaces](INTERFACES.md)
5. [Architecture](ARCHITECTURE.md)
6. [Decisions](decisions/README.md)

## Fact precedence

- Accepted requirements and ADRs are the normative intent: they describe what the project should do and why.
- Human-readable interfaces and their owning schemas, types, or specifications are the boundary contracts.
- Code, automated tests, static checks, and recorded manual checks are implementation evidence: they describe or test current observed behavior but do not authorize intended behavior by themselves.
- Issues, pull requests, meetings, chats, and personal notes provide context but are not the sole home of a durable decision.
- GitHub issues and pull requests own shared task progress, blockers,
  verification, and resume conditions. Private recovery state stays outside
  tracked repository files.

For each non-trivial slice, identify the normative inputs, implementation outputs or boundaries, and falsifiable verification evidence. Traceability helps find missing coverage; it is not proof that generated code is semantically correct.

After the approved issue and issue branch exist, compile approved intent into
the affected durable handbook documents. Issue approval authorizes
automatic persistence of a semantically equivalent documentation-only baseline
as the first commit unique to the issue branch; no second full-document review
is required. Stop only for a material semantic delta, ask one focused question,
update the issue and owning normative source when intent changes, then resume
automatic persistence. Red-Green-Refactor does not apply to that prose-only
baseline, and unresolved protocol or architecture choices cannot be deferred to
TDD.

The pushed baseline is a recovery checkpoint, not a pause. When executable
implementation remains in scope and no concrete stop condition applies,
continue directly into Red instead of asking the user to say “continue” or
announcing that the next phase will begin later.

When sources conflict, preserve the evidence and classify the discrepancy as a specification defect, implementation defect, verification defect, or unrecorded intent change before correcting the owning layer.

## Update map

| Change | Update |
| --- | --- |
| Required behavior | `REQUIREMENTS.md` |
| Module or data-flow responsibility | `ARCHITECTURE.md` |
| Cross-boundary contract | `INTERFACES.md` and its machine-readable source |
| Hard-to-reverse trade-off | A new ADR in `decisions/` |
| Operator procedure | A runbook in `runbooks/` |
