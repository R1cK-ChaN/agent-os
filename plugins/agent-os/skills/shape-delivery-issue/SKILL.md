---
name: shape-delivery-issue
description: Turn a requirement discussion with the user into a self-contained GitHub issue that another agent session can deliver autonomously without chat history. Use while the user and agent clarify a requirement, settle direction, or ask to draft, refine, or create an issue for later implementation. Do not use to implement an issue; use deliver-software-change for that.
---

# Shape a delivery issue

Agent OS pair programming has two phases. In discussion, the user and the agent settle what to build. In delivery, an agent builds it without the user. The issue is the only handoff between them: a fresh session in another worktree, machine, or cloud environment must be able to deliver it from the repository and the issue alone.

## Workflow

1. Read [workspace-security.md](../prepare-development-workspace/references/workspace-security.md) before inspecting repository, Git, provider, log, fixture, credential, or external-service data.
2. Read the nearest repository instructions, relevant code, tests, contracts, and existing issues so the issue uses the repository's real terms, paths, and commands. Check for a duplicate or overlapping issue.
3. Discuss with the user until the direction is settled. At each real fork, give a recommendation and ask. Do not ask about choices the repository already answers.
4. Classify the change as ordinary or major with the criteria in `deliver-software-change`. For a major change, use `design-software-change` during the discussion and record the agreed design in the issue, because the delivering session cannot see the discussion.
5. Read [issue-contract.md](references/issue-contract.md) and draft the issue from its template.
6. Run the handoff check in the same reference. Resolve every failing item with the user or from repository evidence. For a choice that can safely wait, delegate it with an explicit rule instead of leaving it open.
7. Show the user the draft and create the issue once they confirm. Write the body to a file, create it with `gh issue create --body-file`, and read the created body back to confirm real line breaks.
8. Report the issue URL. Start delivery in the same session only when the user asks for it. Otherwise any session can pick it up with `deliver-software-change`.

## Boundaries

- Do not create an issue before the direction is settled. Share drafts in conversation until then.
- Do not write "as discussed" or point to the conversation. Every decision that matters appears in the issue with its rationale.
- Do not put secrets, private task metadata, credentials, or conversation transcripts in the issue.
- Use the repository's issue conventions when they exist; otherwise title the issue `<scope>: <concise behavior change>`.
- Shaping an issue does not authorize implementation, branch creation, or commits.
