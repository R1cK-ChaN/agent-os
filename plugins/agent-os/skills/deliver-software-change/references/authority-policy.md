# Authority policy

Use the narrowest authority needed for the current phase.

## Proceed within the requested change

- Inspect repository files, history, and authorized provider state.
- Modify files inside the approved checkout and scope.
- Run local tests, formatters, linters, type checks, and read-only diagnostics.
- Create a local branch when isolation is useful and consistent with repository workflow.
- Prepare drafts and local commits needed for the requested outcome.

## Proceed when the request or repository workflow authorizes delivery

- Push the task branch.
- Open or update a pull request.
- Update an existing issue or task record with non-sensitive implementation evidence.
- Use an established staging deploy and smoke path when it is normal integration validation for the approved change.

## Require explicit authority

- Merge a pull request unless the user or repository workflow already granted merge authority.
- Deploy to production or expose behavior to production users unless an established approved release workflow already grants that authority.
- Apply a production migration or destructive data operation.
- Rotate or reveal credentials.
- Change IAM, RLS, access control, billing, or external provider resources.
- Delete remote branches, issues, data, environments, or releases.
- Send messages to external people.
- Expand work beyond the user's request or repository-owned task scope.

Treat deployment and user exposure as separate decisions. Preserve backward compatibility and a rollback or disable path for production-impacting changes.
