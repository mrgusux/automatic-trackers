<div align="center">
  <img src="og-image.png" alt="Automatic Trackers Banner" width="100%" />

  # 🚀 Automatic Trackers

  **A frequently updated, automatically sanitized, blacklist-filtered list of BitTorrent Trackers — rebuilt every 6 hours from 95+ community sources.**

  [![Update Trackers](https://github.com/mrgusux/automatic-trackers/actions/workflows/update-trackers.yml/badge.svg)](https://github.com/mrgusux/automatic-trackers/actions/workflows/update-trackers.yml)
  [![Tests](https://github.com/mrgusux/automatic-trackers/actions/workflows/test.yml/badge.svg)](https://github.com/mrgusux/automatic-trackers/actions/workflows/test.yml)
  [![Security Scorecard](https://api.securityscorecards.dev/projects/github.com/mrgusux/automatic-trackers/badge)](https://securityscorecards.dev/viewer/?uri=github.com/mrgusux/automatic-trackers)
  [![Trackers Status](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/mrgusux/automatic-trackers/main/api/badge.json&label=Active%20Trackers&color=brightgreen)](https://raw.githubusercontent.com/mrgusux/automatic-trackers/main/all_trackers.txt)
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

  [Read the Documentation](https://mrgusux.github.io/automatic-trackers) • [Report a Bug](../../issues/new?template=bug_report.yml) • [Request a Feature](../../issues/new?template=feature_request.yml) • [Discussions](../../discussions)
</div>

---

## 🌟 Why This List?

Finding reliable and active BitTorrent trackers is a hassle: public lists are often stale, duplicated, or polluted with dead and malicious trackers. This repository solves that with a fully automated GitHub Actions pipeline that fetches, sanitizes, blacklist-filters, and publishes fresh tracker lists — with zero human intervention.

- **⏱️ Always Fresh:** Lists are rebuilt **every 6 hours** from 95+ sources ([full list](SOURCES.md)).
- **🚫 Blacklist-Filtered:** Known-bad trackers (dead, malicious, flooded) are actively **excluded** via [`blacklist.txt`](blacklist.txt), built from dedicated blocklist sources.
- **🛡️ Deeply Sanitized:** A multi-stage pipeline strips junk, normalizes URLs, removes duplicates, and drops private/localhost/reserved hosts.
- **💥 Crash-Safe:** Built-in guards abort any update where sources mass-fail, so the published lists are never wiped by a bad run.
- **🔌 API Ready:** Developer-friendly JSON endpoints for seamless app integration.
- **🔐 Verifiable:** SHA-256 checksums on every update, Sigstore-signed releases, SBOM, and OpenSSF Scorecard monitoring.
- **🐳 Docker Support:** Run the exact same engine locally with Docker or plain bash.

## 📋 Tracker Lists (Raw Links)

Add these raw links directly to your torrent client (qBittorrent, Transmission, aria2, etc.) to automatically fetch trackers:

* 🔥 **[All Trackers](https://raw.githubusercontent.com/mrgusux/automatic-trackers/main/all_trackers.txt)** — The complete, sanitized, priority-sorted list.
* 📎 **[Comma-Separated](https://raw.githubusercontent.com/mrgusux/automatic-trackers/main/all_trackers_comma.txt)** — Single line, comma-joined (aria2 / paste-friendly).
* ⚡ **[UDP Trackers](https://raw.githubusercontent.com/mrgusux/automatic-trackers/main/udp.txt)** — Fast, low-overhead UDP trackers.
* 🌐 **[HTTPS Trackers](https://raw.githubusercontent.com/mrgusux/automatic-trackers/main/https.txt)** — Secure HTTPS-based trackers only.
* 🟢 **[HTTP Trackers](https://raw.githubusercontent.com/mrgusux/automatic-trackers/main/http.txt)** — HTTP-based trackers (legacy support).
* 🕸️ **[WebSocket Trackers](https://raw.githubusercontent.com/mrgusux/automatic-trackers/main/ws.txt)** — WebTorrent-compatible `ws://` / `wss://` trackers.
* 🚫 **[Blacklist](https://raw.githubusercontent.com/mrgusux/automatic-trackers/main/blacklist.txt)** — Known-bad trackers we exclude (do NOT add these to your client).

> **Legacy note:** [`trackers.txt`](https://raw.githubusercontent.com/mrgusux/automatic-trackers/main/trackers.txt) is an identical alias of `all_trackers.txt`, kept so old hotlinks never break.

<details>
<summary><b>🌍 CDN Mirror (jsDelivr) — faster in some regions, immune to GitHub rate limits</b></summary>

```text
https://cdn.jsdelivr.net/gh/mrgusux/automatic-trackers@main/all_trackers.txt
https://cdn.jsdelivr.net/gh/mrgusux/automatic-trackers@main/udp.txt
https://cdn.jsdelivr.net/gh/mrgusux/automatic-trackers@main/https.txt
https://cdn.jsdelivr.net/gh/mrgusux/automatic-trackers@main/http.txt
https://cdn.jsdelivr.net/gh/mrgusux/automatic-trackers@main/ws.txt
```

</details>

## 🚀 Client Setup (Quick Start)

<details>
<summary><b>qBittorrent</b></summary>

1. Open **Tools → Options → BitTorrent**
2. Tick **Automatically add these trackers to new downloads**
3. Paste this URL:

```text
https://raw.githubusercontent.com/mrgusux/automatic-trackers/main/all_trackers.txt
```

qBittorrent re-fetches the list automatically — set & forget. ✅

</details>

<details>
<summary><b>aria2</b></summary>

```bash
# One-shot run with all trackers:
aria2c --bt-tracker="$(curl -fsSL https://raw.githubusercontent.com/mrgusux/automatic-trackers/main/all_trackers_comma.txt)" <torrent-or-magnet>
```

Or keep a local copy auto-updated with cron:

```bash
0 6 * * * curl -fsSL https://raw.githubusercontent.com/mrgusux/automatic-trackers/main/all_trackers_comma.txt -o ~/.aria2/trackers.txt
```

</details>

<details>
<summary><b>Transmission</b></summary>

```bash
# Add all trackers to an existing torrent (ID 1):
curl -fsSL https://raw.githubusercontent.com/mrgusux/automatic-trackers/main/all_trackers.txt \
  | sed '/^$/d' \
  | xargs -I{} transmission-remote -t 1 -td {}
```

</details>

## 💻 Developer API (Machine-Readable)

Building an app or tool? Pure JSON outputs are updated alongside the raw lists:

| Endpoint | Description |
|---|---|
| [`/api/trackers.json`](https://raw.githubusercontent.com/mrgusux/automatic-trackers/main/api/trackers.json) | Complete tracker list as a JSON array + metadata |
| [`/api/stats.json`](https://raw.githubusercontent.com/mrgusux/automatic-trackers/main/api/stats.json) | Protocol breakdown, success rate, blacklist removals |
| [`/api/badge.json`](https://raw.githubusercontent.com/mrgusux/automatic-trackers/main/api/badge.json) | [Shields.io endpoint](https://shields.io/badges/endpoint-badge) for dynamic badges |

Example — extract all UDP trackers with `jq`:

```bash
curl -fsSL https://raw.githubusercontent.com/mrgusux/automatic-trackers/main/api/trackers.json \
  | jq -r '.trackers[] | select(startswith("udp://"))'
```

Embed the live tracker-count badge in your own project:

```markdown
![Trackers](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/mrgusux/automatic-trackers/main/api/badge.json)
```

## 🔄 Update Schedule & Manual Trigger

| Trigger | Schedule | Details |
|---------|----------|---------|
| **Automated** | Every 6 hours (00:00, 06:00, 12:00, 18:00 UTC) | Cron: `0 */6 * * *` |
| **Manual** | On-demand | [Actions → Update Trackers → Run workflow](../../actions/workflows/update-trackers.yml) (supports `force_fetch` and `debug_mode` options) |

Each run:
- ✅ Fetches from **95+ reputable sources** in parallel (with retries + cached fallback)
- 🧹 Runs the full **sanitization pipeline**
- 🚫 Excludes everything found in **`blacklist.txt`** (rebuilt from [`config/blacklist_sources.txt`](config/blacklist_sources.txt))
- 🛡️ Aborts safely if results fall below the minimum-count or drop-guard thresholds
- 📊 Generates categorized lists (UDP, HTTPS, HTTP, WebSocket) + JSON API + `SHA256SUMS.txt`
- 💾 Auto-commits **only if data actually changed** (idempotency hash check)

## 🐳 Run It Yourself

The whole engine is a single dependency-light bash script — [`scripts/update_trackers.sh`](scripts/update_trackers.sh). The exact same code runs in CI, Docker, and locally.

### Local (no Docker)

```bash
git clone https://github.com/mrgusux/automatic-trackers.git
cd automatic-trackers

make dev     # check prerequisites (bash, curl, jq, ...)
make run     # run the aggregator → lists written to repo root
make test    # run the bats test suite
make lint    # ShellCheck (rules in .shellcheckrc)
```

### Docker (one-shot batch container)

```bash
# Run once - outputs land in ./output/ on your machine, then it exits:
docker compose up --build

# With tunables:
FORCE_FETCH=true DEBUG_MODE=true docker compose up --build

# Cleanup:
docker compose down
```

<details>
<summary><b>⚙️ All tunables (environment variables)</b></summary>

| Variable | Default | Purpose |
|---|---|---|
| `OUTPUT_DIR` | repo root | Where output files are written |
| `CACHE_DIR` | `/tmp/tracker_cache` | Fetch fallback cache |
| `MIN_TRACKER_COUNT` | `150` | Abort if fewer trackers found |
| `DROP_GUARD_PERCENT` | `60` | Abort if list shrinks below N% of previous |
| `MAX_PARALLEL_JOBS` | `8` | Parallel fetch workers |
| `RETRY_ATTEMPTS` | `3` | Retries per source |
| `TIMEOUT_SECONDS` | `15` | Per-request max time |
| `CONNECT_TIMEOUT` | `8` | Per-request connect timeout |
| `FORCE_FETCH` | `false` | `true` = ignore cache fallback |
| `DEBUG_MODE` | `false` | Verbose debug output |

</details>

## 📊 Data Quality Guarantees

The sanitization pipeline ensures:

- ✅ **No private IPs** (RFC-1918: `10.x`, `192.168.x`, `172.16-31.x`, link-local `169.254.x`)
- ✅ **No localhost/loopback** (`127.x`, `0.0.0.0`, `::1`)
- ✅ **No reserved/example hosts** (`example.com`, `.local`, `.onion`, `.internal`)
- ✅ **Valid protocols only** (`udp`, `http`, `https`, `ws`, `wss`)
- ✅ **No known-bad trackers** (blacklist exclusion filtering)
- ✅ **Uniqueness enforced** (full deduplication, normalized lowercase scheme+host)
- ✅ **No HTML/Cloudflare junk** (intelligent response validation)
- ✅ **Clean encoding** (BOM, CR, and control-character removal)

## 🔐 Verify Your Downloads

**Checksums** — regenerated on every update:

```bash
curl -fsSLO https://raw.githubusercontent.com/mrgusux/automatic-trackers/main/all_trackers.txt
curl -fsSLO https://raw.githubusercontent.com/mrgusux/automatic-trackers/main/SHA256SUMS.txt
sha256sum --check --ignore-missing SHA256SUMS.txt
```

**Signatures** — every [release](../../releases) asset is keyless-signed with [Sigstore Cosign](https://docs.sigstore.dev/):

```bash
cosign verify-blob \
  --signature all_trackers.txt.sig \
  --certificate all_trackers.txt.pem \
  --certificate-identity-regexp 'https://github.com/mrgusux/automatic-trackers/' \
  --certificate-oidc-issuer 'https://token.actions.githubusercontent.com' \
  all_trackers.txt
```

Releases also include a CycloneDX **SBOM** (`bom.cdx.json`) and `RELEASE_SHA256SUMS.txt`.

## 📁 Project Structure

```text
automatic-trackers/
├── .github/
│   ├── workflows/
│   │   ├── update-trackers.yml      # Main 6-hourly aggregation (thin CI wrapper)
│   │   ├── test.yml                 # bats test suite runner
│   │   ├── lint.yml                 # ShellCheck + actionlint
│   │   ├── checksum.yml             # SHA256SUMS.txt generator
│   │   ├── release.yml              # Automated releases
│   │   ├── sign-artifacts.yml       # Sigstore keyless signing
│   │   ├── sbom.yml                 # CycloneDX SBOM generation
│   │   └── ...                      # scorecard, stale, labeler, discord alerts
│   ├── labeler.yml                  # PR auto-labeling rules
│   └── ISSUE_TEMPLATE/
├── config/
│   ├── sources.txt                  # All tracker source URLs (single source of truth)
│   └── blacklist_sources.txt        # Known-bad tracker lists (exclusion only)
├── scripts/
│   └── update_trackers.sh           # The aggregation engine (CI + Docker + local)
├── tests/
│   └── tracker_test.bats            # Pipeline test suite
├── api/                             # Auto-generated JSON endpoints
│   ├── trackers.json                # All trackers as JSON array
│   ├── stats.json                   # Statistics & metrics
│   └── badge.json                   # Dynamic badge data
├── docs/                            # GitHub Pages documentation
├── all_trackers.txt                 # Master list (auto-committed)
├── all_trackers_comma.txt           # Comma-separated format
├── udp.txt / https.txt / http.txt / ws.txt   # Protocol-specific lists
├── blacklist.txt                    # Active exclusion list (auto-built)
├── SHA256SUMS.txt                   # Integrity checksums (auto-built)
├── Dockerfile                       # Container runtime
├── docker-compose.yml               # Local one-shot deployment
├── Makefile                         # Build automation
├── README.md                        # This file
└── SOURCES.md                       # Source documentation
```

## 🤝 Contributing

Contributions make the open source community an amazing place to learn, inspire, and create. Any contribution is **greatly appreciated** — you don't even need to write code:

- 🌐 **Propose a tracker source** → [Feature Request](../../issues/new?template=feature_request.yml) (good source = public, plain-text, actively maintained)
- 🐛 **Report a bug** → [Bug Report](../../issues/new?template=bug_report.yml)
- 💡 **Share an idea** → [Discussions](../../discussions)

For code contributions:

1. Read our [Code of Conduct](CODE_OF_CONDUCT.md) and [Contributing Guidelines](CONTRIBUTING.md).
2. Fork the project and create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Set up hooks and verify locally: `pre-commit install`, then `make lint test`.
4. Commit (`git commit -m 'Add some AmazingFeature'`) and push.
5. Open a Pull Request.

See also: [Governance](GOVERNANCE.md) • [Maintainers](MAINTAINERS.md) • [Roadmap](ROADMAP.md) • [Security Policy](SECURITY.md) • [Support](SUPPORT.md)

## ❓ FAQ

<details>
<summary><b>Why did a tracker I use disappear from the list?</b></summary>

Either its upstream sources dropped it, or it entered <a href="blacklist.txt">blacklist.txt</a> (dead / malicious / flooded). If you believe it was removed wrongly, open a bug report.

</details>

<details>
<summary><b>Is adding more trackers safe?</b></summary>

Trackers are just peer-coordination servers — adding them is the same mechanism every torrent client uses. This project distributes only <b>publicly available tracker URLs</b>, never content. What you download remains your responsibility.

</details>

<details>
<summary><b>When was the list last updated?</b></summary>

Check the <code>updated_at</code> field in <a href="https://raw.githubusercontent.com/mrgusux/automatic-trackers/main/api/stats.json">api/stats.json</a>, or look at the latest commit on the main branch.

</details>

## 📜 License & Governance

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information. This project follows an open [Governance Model](GOVERNANCE.md) for transparent decision-making.

## 🙏 Acknowledgments

This project aggregates data from 95+ open-source tracker repositories and live APIs. Special thanks to:

- [ngosang/trackerslist](https://github.com/ngosang/trackerslist)
- [XIU2/TrackersListCollection](https://github.com/XIU2/TrackersListCollection)
- [DeSireFire/animeTrackerList](https://github.com/DeSireFire/animeTrackerList)
- [hezhijie0327/Trackerslist](https://github.com/hezhijie0327/Trackerslist)
- [newTrackon](https://newtrackon.com/) live API
- All community contributors — full credits in [SOURCES.md](SOURCES.md)

---
<div align="center">
  <b>Crafted with ❤️ by the Open Source Community</b><br/>
  <sub>Updated automatically every 6 hours via GitHub Actions • If this saves you time, a ⭐ keeps it alive!</sub>
</div>
