.PHONY: help lint build run clean test dev push

help:
	@echo "🛠️ Ultimate Torrent Tracker Aggregator Pro Max"
	@echo "Available commands:"
	@echo "  make lint    - Run ShellCheck for code quality"
	@echo "  make build   - Build the Docker container"
	@echo "  make run     - Run the aggregator inside Docker"
	@echo "  make clean   - Remove generated text files"
	@echo "  make test    - Run tests"
	@echo "  make dev     - Development setup"

lint:
	@echo "🧹 Running ShellCheck on shell scripts..."
	@find . -name "*.sh" -type f | xargs shellcheck || true

build:
	@echo "📦 Building Docker Image..."
	docker build -t automatic-trackers:latest .

run:
	@echo "🚀 Running the Aggregator..."
	docker run --rm -v $(PWD):/app automatic-trackers:latest

clean:
	@echo "🗑️ Cleaning up generated files..."
	rm -f *.txt .tracker_hash api/*.json

test:
	@echo "✅ Running tests..."
	@[ -d tests ] && bash tests/run_tests.sh || echo "No tests found"

dev:
	@echo "🔧 Setting up development environment..."
	@which docker > /dev/null || (echo "Docker not found!"; exit 1)
	@echo "Development setup complete!"

push: clean
	@echo "📤 Pushing to GitHub..."
	@if [ -z "$${CI+x}" ]; then \
		echo "⚠️ Pushing to main branch locally..."; \
		git add -A && git commit -m "🚀 Auto-update: God Tier Tracker List" && git push origin main; \
	else \
		echo "✅ Running in CI environment - skipping manual push"; \
	fi
