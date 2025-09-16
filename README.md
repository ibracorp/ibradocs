# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## Quick Start

### Using Make (Recommended)

```bash
make setup    # Install dependencies
make dev      # Start development server
make build    # Build for production
make help     # Show all available commands
```

### Using Yarn Directly

```bash
yarn install  # Install dependencies
yarn start    # Start development server
yarn build    # Build for production
```

## Available Commands

### Development
- `make dev` or `yarn start` - Start local development server with hot reloading
- `make serve` or `yarn serve` - Serve built site locally
- `make clean` or `yarn clear` - Clear Docusaurus cache

### Build & Deploy
- `make build` or `yarn build` - Build static site for production
- `make deploy` or `yarn deploy` - Deploy to GitHub Pages

### Quality Checks
- `make lint` or `yarn lint` - Run ESLint to check code quality
- `make lint-fix` or `yarn lint:fix` - Run ESLint and fix auto-fixable issues
- `make format` or `yarn format` - Format code with Prettier
- `make format-check` or `yarn format:check` - Check if code is properly formatted
- `make typecheck` or `yarn typecheck` - Run TypeScript type checking
- `make test` - Run all quality checks (lint + format + typecheck)
- `make check` - Same as `make test`
- `make fix` - Fix linting and formatting issues automatically

### Utilities
- `make swizzle` or `yarn swizzle` - Eject and customize theme components
- `make translations` or `yarn write-translations` - Generate translation files
- `make heading-ids` or `yarn write-heading-ids` - Generate heading IDs for docs

## Deployment

Using SSH:

```bash
USE_SSH=true make deploy
# or
USE_SSH=true yarn deploy
```

Not using SSH:

```bash
GIT_USER=<Your GitHub username> make deploy
# or
GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command builds the website and pushes to the `gh-pages` branch.

## Code Quality & Pre-commit Hooks

This project uses automated code quality tools:

- **ESLint** - TypeScript/React linting with custom rules
- **Prettier** - Code formatting for consistent style
- **Husky** - Git hooks for automation
- **lint-staged** - Run linters on staged files only

### Pre-commit Hook

A pre-commit hook automatically runs on every commit to:
1. Lint and fix JavaScript/TypeScript files with ESLint
2. Format all code with Prettier
3. Only process files that are staged for commit

If the hook finds issues it can't auto-fix, the commit will be rejected. Fix the issues and try committing again.
