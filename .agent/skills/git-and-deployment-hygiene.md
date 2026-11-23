# Git & Deployment Hygiene

## Commit Standards
- **Conventional Commits**: Format all commit messages according to Conventional Commits:
  - `feat: add user authentication flow`
  - `fix: resolve modal z-index stacking trap on mobile`
  - `chore: update dependencies and biome config`
- **Atomic Commits**: Keep commits focused on a single change. Do not bundle unrelated refactoring with feature code.
- **Zero Committed Secrets**: Never commit `.env`, `.env.local`, private keys, or API tokens. Enforce `.gitignore` rules strictly.
- **Local Commits Only**: Automated agent tooling must NEVER run `git push` without explicit user permission. Remote pushes are reserved exclusively for developer manual execution.
