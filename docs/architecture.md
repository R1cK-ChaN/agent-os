# Agent OS architecture

Agent OS is a private control-plane plugin for rebuilding a consistent development workflow in replaceable Codex environments. It stores reusable method and orchestration while durable external systems store project facts and execution state.

## System boundaries

| Concern | Source of truth |
| --- | --- |
| Cross-project method, privacy, and authority | Agent OS plugin |
| Private task, decisions, blockers, and completion evidence | Linear |
| Code, specifications, repository rules, commits, and pull requests | GitHub repository |
| Authorized external actions | Connector, MCP, or provider CLI |
| Runtime data, deployment, and secrets | Cloud provider |
| Temporary editing and verification | Codex environment |

```mermaid
flowchart LR
    L[Private Linear task] --> O[Agent OS workflow]
    O --> G[GitHub repository work]
    G --> P[Merged pull request]
    P --> L
    R[Repository AGENTS.md and specs] --> O
    C[Authorized connectors and cloud providers] <--> O
```

The return edge writes the merged pull-request link and observed evidence to Linear. No edge writes private Linear task metadata to GitHub.

## Delivery lifecycle

1. Start from a Linear issue.
2. Resolve the linked GitHub repository and reuse or create the privacy-safe GitHub issue required for non-trivial work.
3. Load repository-local instructions, specifications, tests, and smoke paths.
4. Create an issue-scoped GitHub branch without private task metadata.
5. Implement Red-Green-Refactor-Verify slices.
6. Review, commit, push, and open a GitHub pull request with scope-first naming.
7. Wait for required checks and merge authority.
8. Observe the merge, then write the merged PR, commit, verification, risk, and follow-up to Linear.
9. Mark the Linear issue complete only after durable evidence is saved.

## Recovery protocol

A fresh environment resumes from the Linear issue, then follows its GitHub links to the pull request, remote branch, and repository. Remote Git state overrides stale checkpoints. Uncommitted local work and previous chat history are disposable and must not be required for recovery.

## Repository shape

```text
.agents/plugins/marketplace.json                  Repository marketplace
plugins/agent-os/.codex-plugin/plugin.json        Installable plugin manifest
plugins/agent-os/skills/execute-linear-issue/     End-to-end orchestration skill
  agents/openai.yaml                              Skill discovery metadata
  references/authority-policy.md                  Approval and safety boundary
  references/completion-checkpoint.md             Post-merge Linear evidence
  references/github-privacy.md                    One-way privacy contract
  references/implementation-lifecycle.md          GitHub delivery protocol
scripts/verify_architecture.py                    Deterministic architecture checks
```

Provider-specific skills, custom MCP servers, apps, hooks, and automations are intentionally absent. Add them only after a concrete repeated use case establishes their contract and verification path.

## Installation model

The private Git repository is the distribution source. Add it as a Codex plugin marketplace, install `agent-os`, authorize the required external systems separately, and open a new task so the installed skill metadata is loaded.

OAuth sessions, tokens, cloud secrets, project code, and project-specific domain knowledge never ship inside the plugin.
