.PHONY: help lint build run clean

# Default command when typing 'make'
help:
	@echo "🛠️ Ultimate Torrent Tracker Aggregator Pro Max"
	@echo "Available commands:"
	@echo "  make lint    - Run ShellCheck for code quality"
	@echo "  make build   - Build the Docker container"
	@echo "  make run     - Run the aggregator inside Docker"
	@echo "  make clean   - Remove generated text files"

lint:
	@echo "🧹 Running ShellCheck..."
	shellcheck .github/workflows/*.yml || echo "Note: Action files might need extraction for pure linting."

build:
	@echo "📦 Building Docker Image..."
	docker build -t automatic-trackers .

run:
	@echo "🚀 Running the Aggregator..."
	docker run --rm -v $(PWD):/app automatic-trackers

clean:
	@echo "🗑️ Cleaning up generated files..."
	rm -f *.txt .tracker_hash
