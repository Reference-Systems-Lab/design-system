# Changesets

Every pull request that changes a published package adds a changeset: `npm run changeset`, then pick
the packages and the bump (a breaking change is a major, per AGENTS.md). CI fails without one.

To release, open a pull request that runs `npm run version-packages`: it bumps the versions, writes
each package's CHANGELOG.md and refreshes the lockfile. Merging it publishes every new version to
GitHub Packages (`.github/workflows/release.yml`). While changesets are pending on `main`, nothing
publishes.
