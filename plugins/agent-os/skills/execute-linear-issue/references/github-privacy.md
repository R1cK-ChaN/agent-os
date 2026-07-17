# GitHub privacy boundary

Keep private task tracking out of every GitHub surface.

## Never publish

- Linear issue identifiers or URLs
- Linear workspace, team, project, cycle, or private status names
- Linear comments, checkpoints, internal decisions, or private blockers
- A mapping that allows an external collaborator to reconstruct the private task
- Magic words or backlinks that connect GitHub to a private Linear issue

Apply the boundary to branch names, commit subjects and bodies, issue titles and bodies, pull-request titles and bodies, review comments, release notes, changelogs, CI labels, and deployment annotations.

The product name “Linear” may appear in Agent OS source and documentation when describing the integration. The prohibition applies to private task metadata, not to truthful documentation of the tool.

## Allowed one-way links

Store these links only on the Linear side:

- GitHub repository
- GitHub issue
- Remote branch
- Pull request
- Merge commit
- Checks or deployment preview

Before publishing a GitHub artifact, inspect the rendered title and body plus the branch and commit metadata. Remove private metadata before the write; do not rely on cleanup after publication.

If an integration automatically syncs private issues into GitHub, stop. Disable that issue-sync path or move the task to a Linear team without it before continuing.
