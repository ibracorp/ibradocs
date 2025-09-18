<div align="center">
  <img src="static/img/ibracorpV3_logo.png" alt="IBRACORP Logo" width="400" />
</div>

# IBRADOCS

**IBRADOCS** - Your comprehensive guide to self-hosting, gaming servers, media management, and homelab infrastructure. Created by IBRACORP™.

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator, with custom IBRACORP branding and enhanced features.

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

## Creating New Documentation

Use the interactive documentation generator to create new guides that follow the IBRACORP template:

```bash
make docs
# or
yarn make:docs
```

This will prompt you for:
- Application/service title
- One-sentence description
- Category (Gaming Servers, Media Servers, Security, etc.)
- Optional: Official docs URL, main website, repository name

The generator will create a new markdown file in the appropriate category directory with all the IBRACORP template structure and placeholders ready for you to fill in.

## Available Commands

### Development
- `make dev` or `yarn start` - Start local development server with hot reloading
- `make serve` or `yarn serve` - Serve built site locally
- `make clean` or `yarn clear` - Clear Docusaurus cache
- `make docs` or `yarn make:docs` - Interactive documentation generator

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

## Features

### 📚 Documentation Structure
- **Gaming Servers** - Minecraft, Palworld, and more
- **Media Management** - Plex, Jellyfin, Sonarr, Radarr automation
- **Networking** - VPNs, firewalls, connectivity solutions
- **Reverse Proxies** - Nginx Proxy Manager, Traefik setups
- **Security** - Authentication, SSL, best practices
- **Tools & Utilities** - Monitoring, backup, productivity apps

### 🚀 Enhanced User Experience
- **Interactive Cards** - Visual navigation with descriptions and icons
- **Status Dashboard** - System health and updates section
- **Community Integration** - Discord, YouTube, GitHub links
- **Responsive Design** - Perfect on desktop, tablet, and mobile

### ⚡ Developer Experience
- **Yarn Package Manager** - Fast, reliable dependency management
- **Make Commands** - Simplified development workflow
- **TypeScript** - Full type safety throughout
- **Modern Tooling** - ESLint, Prettier, Husky pre-commit hooks

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

## IBRACORP Brand Guidelines

### Colors
- **Primary Red**: `#E94B3C` (RGB: 233, 75, 60)
- **Dark Variants**: Auto-generated from primary
- **Usage**: Buttons, links, hover states, accents

### Typography
- **Headings**: Bold, clear hierarchy
- **Body**: Optimized line-height (1.6) for readability
- **Code**: Monospace with syntax highlighting

### Design Principles
- **Dark First**: Default dark mode for tech audience
- **High Contrast**: Ensure readability in both themes
- **Modern**: Clean cards, smooth animations, glass effects
- **Mobile Ready**: Responsive design for all devices

## Contributing

1. **Fork & Clone**: Set up your development environment
2. **Install Dependencies**: `make setup` or `yarn install`
3. **Start Development**: `make dev` or `yarn start`
4. **Quality Check**: `make check` before committing
5. **Submit PR**: Follow conventional commit messages

## Community Links

- 💬 **Discord**: [Join IBRACORP Community](https://discord.gg/ibracorp)
- 📺 **YouTube**: [IBRACORP Channel](https://youtube.com/@ibracorp)
- 🐙 **GitHub**: [IBRACORP Organization](https://github.com/ibracorp)
- 💝 **Support**: [Donate via PayPal](https://paypal.me/ibracorp)

---

**Built with ❤️ by IBRACORP™** - Empowering the self-hosting community with quality documentation and guides.
