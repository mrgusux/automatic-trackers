# 🗺️ Project Roadmap

The official roadmap for the **Ultimate Torrent Tracker Aggregator**. This is a living document — it changes based on community feedback and upstream ecosystem changes.

## ✅ Done (Shipped)

- ⏰ Automated aggregation every 6 hours via GitHub Actions
- 🧹 Multi-stage sanitization pipeline (BOM/control-char stripping, protocol validation, private-IP filtering, deduplication)
- 🚫 **Blacklist exclusion filtering** — known-bad trackers are collected into `blacklist.txt` and removed from all final lists
- 📦 Machine-readable JSON outputs (`api/stats.json`, `api/badge.json`, `api/trackers.json`)
- 🐳 Docker & Docker Compose support for self-hosted runs
- 🧾 SBOM generation and 🔐 Sigstore-signed release artifacts
- ✅ ShellCheck linting and bats test suite in CI

## 🟢 Now (Current Focus)

- Stabilize the v2.0 architecture (`scripts/update.sh` as single source of truth, config-driven source lists)
- Keep the source lists healthy: prune dead sources, add reliable new ones
- Maintain fast CI runs with parallel fetching and persistent caching

## 🟡 Next (Upcoming)

- **Source health report:** per-source success-rate history published to `api/sources.json`, so chronically dead sources are flagged automatically
- **Automated releases:** semantic-versioned GitHub Releases generated on significant list changes
- **GitHub Pages site:** human-friendly landing page with live stats and one-click copy buttons

## 🔵 Later (Long-term Vision)

- **Tracker health database:** uptime/latency probing of individual trackers to build a reliability-ranked `best.txt`
- **REST API endpoint:** lightweight hosted API serving the lists programmatically with filtering options
- **IPv6 tracker support:** dedicated `ipv6.txt` output for IPv6-only swarms

## 💬 Influence This Roadmap

Want something prioritized? [Open a Feature Request](https://github.com/mrgusux/automatic-trackers/issues/new?template=feature_request.yml) or vote on existing ones with 👍.
