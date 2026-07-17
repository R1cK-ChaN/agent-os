# Checkpoint record

Record only concise, non-sensitive recovery evidence:

- **State:** `reviewable` or `recoverable-only`.
- **Commit:** exact pushed commit SHA and remote branch.
- **Verification:** commands and observed outcomes, including failed or skipped checks.
- **Completed phase:** the coherent phase that ended at this commit.
- **Next step:** one concrete action that resumes the approved slice.
- **Blocker:** external wait, missing authority, failed check, or `none`.
- **Unpersisted risk:** any intentionally local state that a replaced environment would lose.

Write repository-facing evidence only to the owning GitHub issue or explicitly scoped cumulative draft pull request. Keep private decisions and private task status in the approved private task system. Do not use chat, a local note, or an unpushed commit as the only checkpoint record.
