# PNPM Monorepo Guidelines & Non-Negotiable Rules

Follow these rules strictly to prevent workspace and registry 404 errors:

1. **Single Package Manager**: Use ONLY `pnpm`. Never introduce `bun`, `npm`, or `yarn` lockfiles. Do NOT generate `bun.lock`, `bunfig.toml`, or `package-lock.json`. Only use `pnpm-lock.yaml`.
2. **Root Workspace Configuration**: Maintain `pnpm-workspace.yaml` in the root directory mapping all workspace paths (`artifacts/*`, `lib/*`, `scripts`).
3. **Workspace Protocol for Internal Dependencies**: Any internal package reference inside any `package.json` file must use the exact `workspace:*` protocol (e.g. `"@workspace/db": "workspace:*"`, `"@workspace/api-client-react": "workspace:*"`). Never use version numbers or leave them blank or `*`, which forces pnpm to look on the public npm registry.
4. **Clean Alignment**: Ensure that package names defined in internal `package.json` files match exactly how they are imported and referenced across the monorepo.
