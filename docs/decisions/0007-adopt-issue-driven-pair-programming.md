# ADR 0007: Adopt issue-driven pair programming

- Status: Accepted
- Date: 2026-10-22
- Related: ADR 0004, ADR 0005, ADR 0006

## Context

Agent OS is used for pair programming between its owner and coding agents. The user and an agent first discuss a requirement until the direction is settled and an issue is created. An agent then delivers that issue without the user, in the same session, a new local worktree, or a cloud environment.

ADR 0006 made issues optional, which remains right for ad-hoc ordinary changes. But nothing defined what an issue must contain to be delivered without the discussion behind it. Nothing gave a supplied issue authority over scope, and nothing set where autonomous delivery ends. The plugin also shipped only a Codex manifest, so Claude Code sessions could not use it.

## Decision

- Pair programming has two phases with the issue as the only handoff. `shape-delivery-issue` turns a settled discussion into a self-contained issue that passes a handoff check: verifiable acceptance criteria, explicit non-goals, recorded decisions with rationale, design for a major change, no references to the conversation, and a stated delivery endpoint.
- A supplied issue is the execution contract. The delivering agent does not ask for approved decisions again. It stops and comments on the issue when the issue is incomplete or a material semantic delta contradicts it.
- Issue-driven delivery opens a draft pull request with `Closes #<number>` at the first push, so any later session can find and resume the work from the issue.
- The default delivery endpoint is merge after every required CI check passes, using squash when the repository allows several methods. A repository without CI checks on the pull request stops at the ready pull request. The issue or repository policy can set a stricter endpoint.
- After merging, the agent returns to the default branch and pulls, except inside a worktree that an app or another session manages.
- The plugin ships manifests for both Codex and Claude Code from the same skills, and Codex-specific instructions are removed from the Skills.
- Automated review is no longer mentioned by the Skills. Review runs when the user or repository asks for it.

## Consequences

- Delivery quality depends on issue quality, so the discussion phase carries an explicit checklist.
- Autonomous delivery can finish with a merged change and no further user action, bounded by CI and the issue's endpoint.
- Ad-hoc ordinary changes still need no issue.
- Both plugin manifests must carry a bumped version whenever bundled Skills or templates change.

## Verification

- Confirm a fresh session can deliver an issue created by `shape-delivery-issue` without chat history.
- Confirm a delivering session resumes from the linked pull request after interruption.
- Confirm merge happens only after required CI checks pass and never implicitly in a repository without CI.
- Confirm `claude plugin validate` passes for the marketplace and plugin, and Codex lists the same Skills.
