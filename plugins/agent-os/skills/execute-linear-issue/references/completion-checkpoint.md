# Completion checkpoint

Write this checkpoint on the originating Linear issue only after the pull request is merged.

```md
## Delivery result

Status: Completed
Repository: <owner/repository>
Pull request: <merged GitHub pull request URL>
Merge commit: <full commit SHA>
Merged at: <ISO-8601 timestamp>

Shipped:
- <externally visible behavior>
- <important compatibility or architecture decision>

Verification:
- <command or check>: <result>

Review:
- Codex review rounds: <count>
- Remaining material findings: <none or list>

Risk and rollout:
- Production exposure: <not applicable, disabled, internal, canary, or approved>
- Rollback or disable path: <path>

Follow-up:
- <none or durable next action>
```

Attach the pull-request URL as a Linear link resource in addition to the comment or description update. Record observed GitHub values; never infer a merge SHA, check result, timestamp, deployment, or exposure state.

Move the issue to the team's completed state only after the checkpoint write succeeds. If the write fails, keep the task open and report the persistence blocker.

Treat the linked post-merge review as a non-blocking audit by default. If the user or Linear issue defines review as an acceptance gate, keep the task in its review state until that approval is recorded instead of marking it complete at merge.
