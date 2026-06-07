# Changelog

All notable changes to the **Ultimate Torrent Tracker Aggregator Pro Max** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Enterprise 12-stage sanitization pipeline for strict tracker formatting.
- Cloudflare bypass using rotating modern User-Agents.
- Full Jitter Exponential Backoff for smart retry logic.
- SHA256 idempotency check to prevent empty or redundant commits.
- Added 98 top-tier internet sources for maximum coverage.
- GitHub Actions workflow for automated 6-hour fetch cycles.

### Changed
- Improved regex parsing to strip hidden BOM/CR characters perfectly.

### Security
- Strict filtering mechanism to block RFC-1918 private/local IP addresses.
