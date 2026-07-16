# Issue and authority contract

Use this precedence order, subject to platform security and authorization constraints:

1. Follow the user's current explicit instruction.
2. Follow the closest target-repository `AGENTS.md`, established contracts, and release tooling.
3. Treat the approved Linear issue as the complete private product scope.
4. Treat the GitHub issue as a privacy-safe implementation projection.
5. Use Agent OS defaults only where higher-priority sources are silent.

Linear is the private scope authority. A GitHub issue is a privacy-safe implementation projection and must never expand the Linear scope.

A current explicit user instruction may clarify or change the approved scope. When it adds or materially changes implementation work, amend the Linear issue before implementation and wait for that durable write to succeed. Then update only the privacy-safe consequences in the GitHub issue. Do not let a conversational instruction create undocumented scope drift.

## Classify the task

- **Read-only:** Explain, investigate, review, or report without implementation writes.
- **Trivial:** Make an obvious, low-risk, narrowly scoped change that does not need a new implementation issue unless the repository requires one.
- **Non-trivial:** Change behavior, multiple files, interfaces, persistence, deployment, architecture, or other meaningful system behavior.

For non-trivial work, orient before proposing mechanisms. Inspect the closest instructions, existing contracts, tests, fixtures, scripts, and smoke paths that could already satisfy the request.

## Project the private scope into GitHub

Preserve enough product and engineering context to implement and review the change, but remove private sources, Linear identifiers and links, internal discussion, and unrelated business context.

Include request or symptom, current gap or root cause, testable acceptance criteria, Red-Green-Refactor-Verify plan, in-scope and out-of-scope boundaries, risk, verification, and release or exposure notes when applicable.

Reuse an existing GitHub issue when it already matches the approved scope. Otherwise create the sanitized issue after the user approves its public content or after an explicitly pre-authorized workflow permits an equivalent projection. Ask when sanitization changes meaning, public exposure is uncertain, or the GitHub issue would broaden scope.

When investigation changes the facts, update Linear first. Update the GitHub issue only with the privacy-safe implementation consequences.
