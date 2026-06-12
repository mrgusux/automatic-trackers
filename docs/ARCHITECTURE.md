# 🏛️ System Architecture

Architectural overview of the **Ultimate Torrent Tracker Aggregator** — how the pipeline fetches, filters, and distributes BitTorrent trackers every 6 hours.

## 🧩 Core Design Principle: Single Source of Truth

All aggregation logic currently lives in **one place**: the build step of
[`.github/workflows/update-trackers.yml`](../.github/workflows/update-trackers.yml).
The tracker source list (`SOURCES` array) and the blacklist source list
(`BLACKLIST_SOURCES` array) are both defined there.

> **Planned:** the engine will be extracted into `scripts/update_trackers.sh` with
> sources moved to standalone config files, so GitHub Actions, Docker, the Makefile,
> and the test suite all execute the exact same code. This document will be updated
> when that lands.

| Component | Responsibility |
| --- | --- |
| `.github/workflows/update-trackers.yml` | The engine + scheduler: fetch → sanitize → blacklist-filter → sort → publish → commit (every 6 hours) |
| `SOURCES` array (in the workflow) | List of good-tracker source URLs |
| `BLACKLIST_SOURCES` array (in the workflow) | Known-bad tracker sources used for exclusion |
| `blacklist.txt` | Generated, accumulative list of bad trackers (never shrinks) |
| `tests/tracker_test.bats` | Verifies the filtering rules of the engine |
| `Dockerfile` / `docker-compose.yml` | Self-hosted one-shot runs of the same pipeline |

## 🔄 The Pipeline Flow

```mermaid
graph TD
    CRON[Cron: every 6 hours] --> VAL[Validate source config<br/>no duplicates, valid URLs]
    VAL --> CACHE[Restore fetch fallback cache<br/>actions/cache]

    CACHE --> SRC[Fetch tracker sources<br/>parallel xargs -P, retries with backoff,<br/>cached copy used only as FALLBACK]
    SRC --> RAW[Raw text aggregation]

    RAW --> SAN{Sanitization}
    SAN --> S1[Strip BOM / control chars / HTML / quotes]
    SAN --> S2[Split comma-joined lines,<br/>drop double-scheme & glued URLs]
    SAN --> S3[Keep only udp / http / https / ws / wss]
    SAN --> S4[Drop localhost, RFC-1918 IPs,<br/>reserved domains; lowercase host; dedupe]

    CACHE --> BL[Fetch blacklist sources]
    BL --> BLT[Sanitize + merge with existing<br/>blacklist.txt - accumulative]

    S1 & S2 & S3 & S4 --> FIL[Blacklist exclusion filter<br/>match by exact URL and host:port]
    BLT --> FIL

    FIL --> SORT{Priority sort}
    SORT -->|1| UDP[udp.txt]
    SORT -->|2| HTTPS[https.txt]
    SORT -->|3| HTTP[http.txt]
    SORT -->|4| WS[ws.txt]

    UDP & HTTPS & HTTP & WS --> GATE{Safety gates:<br/>count >= MIN_TRACKER_COUNT?<br/>count >= 60% of previous run?}
    GATE -->|No| FAIL[Fail run - protect existing lists]
    GATE -->|Yes| OUT[all_trackers.txt + trackers.txt mirror<br/>+ comma list + JSON APIs via jq<br/>+ SHA256SUMS.txt]

    OUT --> HASH{Idempotency check<br/>SHA256 vs .tracker_hash}
    HASH -->|Changed| COMMIT[Commit & push outputs<br/>with retry + rebase]
    HASH -->|Unchanged| SKIP[Skip commit - save resources]
