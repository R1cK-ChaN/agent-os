# Issue-driven delivery

Use this reference when the user supplies a GitHub issue to deliver. The issue was usually shaped with `shape-delivery-issue`: the user and an agent settled the direction in discussion, and the issue now holds everything that discussion decided. The delivering session may be the same one, a new local session or worktree, or a cloud environment. It must not depend on chat history.

## Entry

1. Read the issue body and every comment, for example with `gh issue view <number> --comments`. Later comments from the user amend the contract.
2. Find existing work before starting new work: pull requests linked to the issue or whose body references it, and remote branches for it. When one exists, resume from its latest durable commit instead of restarting.
3. Check the issue against the handoff check in [issue-contract.md](../../shape-delivery-issue/references/issue-contract.md). When acceptance criteria are missing, a required decision is unresolved, or the delivery endpoint is absent, comment on the issue with the specific gap, tell the user, and stop. Do not fill a material gap by guessing.

## Execution

- Treat the issue's goal, scope, non-goals, decisions, and delivery endpoint as approved. Do not ask for them again, and do not reopen a recorded decision without new evidence.
- Do not expand scope. Record follow-up work in the pull request instead of doing it.
- Resolve a delegated choice with the rule the issue gives, and record the choice in the pull request.
- When implementation shows that a recorded decision is wrong, a non-goal must be crossed, or an acceptance criterion cannot be met as written, that is a material semantic delta. Stop, comment on the issue with the evidence, the options, and a recommendation, and tell the user.
- At the first push, open a draft pull request whose body contains `Closes #<number>`. This makes the in-progress work discoverable from the issue and is the recovery anchor for any later session.
- Keep GitHub as the shared record: blockers, deltas, and evidence go on the issue or pull request.

## Completion

1. Write the pull-request body with a summary, each acceptance criterion with its evidence, the verification commands and observed results, choices made under delegation, and follow-ups. Use `--body-file` and read the body back.
2. Mark the pull request ready for review when every acceptance criterion is met and the relevant verification passes.
3. Merge according to the issue's delivery endpoint. The default endpoint is merge after CI:
   - Wait for the required CI checks on the pull request. When a check fails, fix the cause and push again. When a failure is outside the change and cannot be fixed within scope, comment on the pull request and stop.
   - When every required check passes, merge with the method the repository allows. When several are allowed, prefer squash so the issue lands as one commit.
   - When the repository runs no CI checks on the pull request, stop at the ready pull request and tell the user. Local verification alone does not grant merge authority.
   - When the endpoint is "stop at pull request", or repository policy requires review, stop at the ready pull request.
4. After merging, confirm the issue closed. Then switch to the default branch and pull the latest remote state, except in a worktree that the app or another session manages; leave such a worktree on its branch.
5. Deploy or expose the change to production only when the issue's release field and [authority-policy.md](authority-policy.md) both allow it.
