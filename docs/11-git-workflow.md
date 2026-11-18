# Git Branching & Merging Strategy

To keep our commit history clean, readable, and easy to navigate, follow these rules for branches, commits, and Pull Requests.

## Branch Naming

Name branches using the type of work, same types as our commits:

- **feat/short-description** — new feature (e.g. `feat/user-preference`)
- **fix/short-description** — bug fix (e.g. `fix/login-crash`)
- **chore/short-description** — maintenance, no feature change (e.g. `chore/db-indexes`)
- **hotfix/short-description** — urgent production fix

## Commit Messages

Every commit follows Conventional Commits format:

```
type(scope): short description
```

Examples:

- `feat(user-preference): add recommendation rules for onboarding answers`
- `fix(db): cache prisma pg adapter only in dev`
- `chore(db): store timestamps as timestamptz`

## Opening & Merging Pull Requests

Always merge via GitHub PRs — never merge directly from the local terminal.

**PR description** — add a short `## Summary` with 1-3 bullets describing what changed and why. Keep it simple enough that anyone on the team can understand it without reading the code.

**PR title** — same Conventional Commits format as commits:

```
feat(scope): short description
```

**Merge commit message** — when clicking merge on GitHub, set the commit title to:

```
Merge pull request #[PR_Number] to [Target_Branch]: [short summary]
```

Examples:

- `Merge pull request #1 to develop: custom auth flow`
- `Merge pull request #14 to develop: fix mobile checkout crash`

**Extended description** — always add 1-2 lines explaining what the PR does. Include migrations, env vars, or breaking changes if any.

## Post-Merge Cleanup

After your PR is merged, clean up locally:

```bash
git checkout develop
git pull origin develop
git branch -d feat/your-branch-name (optional if you want to delete the branch after merging the branch successfully )
```
