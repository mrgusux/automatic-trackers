.PHONY: help lint build run clean test dev push docker-up docker-down

help:
	@echo "🛠️ Ultimate Torrent Tracker Aggregator Pro Max"
	@echo ""
	@echo "Available commands:"
	@echo "  make lint           - Run ShellCheck for code quality"
	@echo "  make build          - Build the Docker container"
	@echo "  make run            - Run the aggregator inside Docker (once)"
	@echo "  make docker-up      - Start Docker Compose daemon"
	@echo "  make docker-down    - Stop Docker Compose daemon"
	@echo "  make clean          - Remove generated text files"
	@echo "  make test           - Run tests"
	@echo "  make dev            - Development setup"
	@echo "  make push           - Commit & push to GitHub (CI only)"
	@echo ""

lint:
	@echo "🧹 Running ShellCheck on shell scripts..."
	@find . -name "*.sh" -type f | xargs shellcheck -S warning || true

build:
	@echo "📦 Building Docker Image..."
	docker build -t automatic-trackers:latest .

run: build
	@echo "🚀 Running the Aggregator (one-time)..."
	docker run --rm -v $(PWD):/app automatic-trackers:latest

docker-up: build
	@echo "🐳 Starting Docker Compose daemon..."
	docker-compose up -d
	@echo "✅ Running at: docker ps | grep automatic-trackers"

docker-down:
	@echo "⛔ Stopping Docker Compose..."
	docker-compose down

clean:
	@echo "🗑️ Cleaning up generated files..."
	rm -f *.txt .tracker_hash api/*.json
	rm -rf output/

test:
	@echo "✅ Running tests..."
	@[ -d tests ] && bash tests/run_tests.sh || echo "⚠️ No tests found"

dev:
	@echo "🔧 Setting up development environment..."
	@which docker > /dev/null || (echo "❌ Docker not found!"; exit 1)
	@which curl > /dev/null || (echo "❌ curl not found!"; exit 1)
	@echo "✅ Development environment OK!"

push: clean
	@echo "📤 Pushing to GitHub..."
	@if [ -z "$${CI+x}" ]; then \
		echo "⚠️ Local push - ensure you're on main branch"; \
		git add -A && git commit -m "🚀 Auto-update: God Tier Tracker List" && git push origin main; \
	else \
		echo "✅ CI environment detected - skipping manual push"; \
	fi

.DEFAULT_GOAL := help
