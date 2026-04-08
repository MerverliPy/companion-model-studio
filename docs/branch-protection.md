# Branch protection recommendations

Protect `main` with these settings:

- Require a pull request before merging
- Require at least 1 approval
- Require review from Code Owners
- Require status checks to pass before merging
- Required status check: `validate`
- Dismiss stale pull request approvals when new commits are pushed
- Block force pushes
- Block deletions
