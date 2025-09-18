# Docusaurus Development Makefile
.PHONY: help install dev build serve clean deploy test lint typecheck docs

# Default target
help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	yarn install

dev: ## Start development server
	yarn start

build: ## Build for production
	yarn build

serve: ## Serve built site locally
	yarn serve

clean: ## Clear Docusaurus cache
	yarn clear

deploy: ## Deploy to GitHub Pages
	yarn deploy

docs: ## Interactive documentation generator
	yarn make:docs

test: lint format-check typecheck ## Run all quality checks

lint: ## Run ESLint to check code quality
	yarn lint

lint-fix: ## Run ESLint and fix auto-fixable issues
	yarn lint:fix

format: ## Format code with Prettier
	yarn format

format-check: ## Check if code is properly formatted
	yarn format:check

typecheck: ## Run TypeScript type checking
	yarn typecheck

# Development workflow shortcuts
setup: install ## Initial project setup
	@echo "✅ Project setup complete! Run 'make dev' to start development."

check: test ## Run full quality check suite
	@echo "✅ All quality checks passed!"

fix: lint-fix format ## Fix linting and formatting issues
	@echo "✅ Code formatting and linting issues fixed!"

# Utility targets
swizzle: ## Eject and customize theme components
	yarn swizzle

translations: ## Generate translation files
	yarn write-translations

heading-ids: ## Generate heading IDs for docs
	yarn write-heading-ids