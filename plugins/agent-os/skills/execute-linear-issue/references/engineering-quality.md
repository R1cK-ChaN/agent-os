# Engineering quality

## Use evidence-driven implementation

For non-trivial behavior, follow Red, Green, Refactor, then Verify. Write the smallest failing test or deterministic check first. For documentation-only scaffolds, generated files, mechanical formatting, or changes where a meaningful failing test cannot exist, record the exception and use the narrowest deterministic validation available.

Prefer concrete implementations before introducing reusable abstractions. Use three concrete uses as a default evidence threshold, not a hard rule. Abstract earlier when a stable domain boundary, security invariant, provider boundary, or independently testable contract already exists.

After each slice, scan for code and documentation that can be removed, merged, or simplified.

## Review without endless loops

Run Codex review before committing meaningful implementation. Fix correctness bugs, broken invariants, security or data-loss risks, and concrete edge cases. Reject style-only scope growth, speculative defenses, and premature abstractions.

Run at most two automated review rounds. If a material finding remains after the second round, stop before committing and report it to the user. The round limit prevents an endless review loop; it does not lower the quality threshold.

## Persist each completed slice

Run relevant tests and exercise the changed path. Inspect status, diff statistics, and the full diff. Commit with a scope-first imperative subject, push the issue branch, and update the GitHub issue with the commit, shipped change, decisions, review rounds, verification before and after, closed phase, and next step.

After opening the pull request, continue only for user-requested, review-driven, or CI-driven fixes. Do not expand the approved scope merely because the branch remains open.
