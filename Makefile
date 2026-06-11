# =============================================================================
# Ultimate Torrent Tracker Aggregator - Makefile
# Run `make` or `make help` to see all available commands.
# =============================================================================

SHELL := /usr/bin/env bash
.DEFAULT_GOAL := help

IMAGE_NAME := automatic-trackers:latest

.PHONY: help lint test run build docker-up docker-down clean dev

help: ## Show this help message
    @echo "🛠️  Ultimate Torrent Tracker Aggregator"
    @echo ""
    @echo "Available commands:"
    @grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
        | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36mmake %-12s\033[0m %s\n", $$1, $$2}'
    @echo ""

lint: ## Run ShellCheck on all shell scripts
    @echo "🧹 Running ShellCheck..."
    shellcheck --severity=warning scripts/*.sh

test: ## Run the bats test suite
    @echo "✅ Running bats tests..."
    bats tests/

run: ## Run the aggregator locally (no Docker)
    @echo "🚀 Running aggregator locally..."
    bash scripts/update.sh

build: ## Build the Docker image
    @echo "📦 Building Docker image..."
    docker build -t $(IMAGE_NAME) .

docker-up: build ## Run the aggregator via Docker Compose (one-shot)
    @echo "🐳 Running via Docker Compose..."
    docker compose up --build

docker-down: ## Stop and remove Docker Compose resources
    @echo "⛔ Stopping Docker Compose..."
    docker compose down

clean: ## Remove generated files (tracked files restorable via `git restore .`)
    @echo "🗑️  Removing generated files..."
    rm -f all_trackers.txt all_trackers_comma.txt udp.txt http.txt https.txt ws.txt blacklist.txt .tracker_hash
    rm -f api/stats.json api/badge.json api/trackers.json
    rm -rf output/ .cache/

dev: ## Verify development prerequisites
    @echo "🔧 Checking development prerequisites..."
    @command -v bash >/dev/null       || { echo "❌ bash not found"; exit 1; }
    @command -v curl >/dev/null       || { echo "❌ curl not found"; exit 1; }
    @command -v jq >/dev/null         || { echo "❌ jq not found"; exit 1; }
    @command -v docker >/dev/null     || echo "⚠️  docker not found (needed for make build/docker-up)"
    @command -v shellcheck >/dev/null || echo "⚠️  shellcheck not found (needed for make lint)"
    @command -v bats >/dev/null       || echo "⚠️  bats not found (needed for make test)"
    @echo "✅ Core prerequisites OK"
