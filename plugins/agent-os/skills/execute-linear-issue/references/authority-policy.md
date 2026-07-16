# Authority policy

Use the narrowest authority needed for the current phase.

## Proceed without additional approval

- Read authorized Linear and GitHub state
- Inspect repository files and history
- Modify files inside the approved checkout and scope
- Run local tests, formatters, linters, type checks, and read-only diagnostics
- Prepare drafts for review

## Proceed when the approved workflow already authorizes it

- Create the issue-scoped branch
- Commit an approved implementation slice
- Push the task branch
- Open or update a draft pull request
- Attach GitHub links and verification evidence to the originating Linear issue
- Move the Linear issue through ordinary in-progress or review states
- Use an established staging deploy and smoke path when the approved repository workflow treats it as normal integration validation

## Require explicit authority

- Merge a pull request unless the user or repository workflow already granted merge authority
- Deploy to production or expose behavior to production users unless an established approved release workflow already grants that authority
- Apply a production migration or destructive data operation
- Rotate or reveal credentials
- Change IAM, RLS, access-control, billing, or external provider resources
- Delete remote branches, issues, data, environments, or releases
- Send messages to external people
- Expand work beyond the approved issue scope

Treat deployment and user exposure as separate decisions. Do not add an approval step merely because an isolated staging environment runs the enabled path. Preserve backward compatibility and a rollback or disable path for production-impacting changes.
