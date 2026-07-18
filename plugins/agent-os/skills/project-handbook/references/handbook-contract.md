# Project handbook contract

The project handbook is a small, repository-owned working set, not a document warehouse.

| File | Owns | Update when |
| --- | --- | --- |
| `README.md` | Project entry point and first commands | The project entry path or stable setup changes |
| `AGENTS.md` | Collaboration rules and local constraints | Repository workflow or ownership rules change |
| `docs/INDEX.md` | Document routing and fact precedence | The handbook shape or source ordering changes |
| `docs/REQUIREMENTS.md` | Numbered requirements | Required behavior changes |
| `docs/NOW.md` | Current work, blockers, decisions, and handoff | Work starts, changes state, blocks, or completes |
| `docs/ARCHITECTURE.md` | Current system boundaries and responsibilities | Architecture or data flow changes |
| `docs/INTERFACES.md` | Cross-module and provider contracts | A boundary, schema, error, or compatibility rule changes |
| `docs/decisions/` | Append-only decision history | A surprising, hard-to-reverse trade-off is accepted |
| `docs/runbooks/` | Operational procedures | An operator-facing procedure changes |
| `docs/references/` | Curated external or supporting references | A durable reference is needed by the project |

When a project already uses equivalent paths or generated contracts, preserve them and link them from `docs/INDEX.md` instead of creating duplicate sources of truth.
