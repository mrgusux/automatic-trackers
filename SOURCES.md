# 🌐 Tracker Sources Directory

Transparency and data integrity are core principles of the **Ultimate Torrent Tracker Aggregator**. This document explains where our tracker data comes from and how it is filtered.

## 📌 Single Source of Truth

The complete, always-current source lists live in version-controlled config files — **not** in this document, so this page can never go stale:

| File | Purpose |
|---|---|
| [`config/sources.txt`](config/sources.txt) | All tracker list URLs we aggregate (one per line) |
| [`config/blacklist_sources.txt`](config/blacklist_sources.txt) | Known-bad tracker lists used for **exclusion filtering** |

Every source file is automatically validated on each run (no duplicates, valid `http(s)://` URLs only).

## 📊 Source Categories

### 1. Primary Repositories (GitHub)
Major community-maintained tracker collections, fetched in multiple variants (all / best / udp / http / https / ws / ip):
- [ngosang/trackerslist](https://github.com/ngosang/trackerslist)
- [XIU2/TrackersListCollection](https://github.com/XIU2/TrackersListCollection)
- [DeSireFire/animeTrackerList](https://github.com/DeSireFire/animeTrackerList)
- [hezhijie0327/Trackerslist](https://github.com/hezhijie0327/Trackerslist)
- [Naunter/BT_Trackers](https://github.com/Naunter/BT_Trackers)
- Plus many smaller community lists — see [`config/sources.txt`](config/sources.txt) for the full list.

### 2. Live APIs
Real-time tracker status data:
- **newTrackon API** — `https://newtrackon.com/api/` (all, stable, live, udp, http, uptime-percentage endpoints)

### 3. CDN Mirrors
jsDelivr / Fastly mirrors of the primary repositories. These provide redundancy: if GitHub rate-limits or a raw URL is unreachable, the same data is still fetched from a mirror.

### 4. Blacklist Sources (Exclusion Filtering)
Some sources contain **known-bad trackers** (dead, malicious, or flooded). These are *fetched but never merged* into the final lists. Instead:

1. Their contents are sanitized and written to [`blacklist.txt`](blacklist.txt).
2. Every tracker in `blacklist.txt` is **removed** from `all_trackers.txt`, `udp.txt`, `http.txt`, `https.txt`, and `ws.txt`.

Current blacklist sources include `crazy-max/blocklist`, `bitjerry/BlackList`, and the official `ngosang/trackerslist` blacklist.

## 🧹 Sanitization Pipeline

Every fetched line passes through the pipeline in [`scripts/update.sh`](scripts/update.sh):

1. Strip BOM, carriage returns, control characters, and HTML tags
2. Trim whitespace and normalize to lowercase
3. Keep only valid `udp://`, `http://`, `https://`, `ws://`, `wss://` URLs
4. Drop localhost, private (RFC-1918), and link-local addresses
5. Drop reserved/example domains (`example.com`, `.local`, `.onion`, `.internal`)
6. Remove duplicates
7. **Exclude everything found in `blacklist.txt`**
8. Sort by protocol priority: `udp` → `https` → `http` → `ws`

## 🤝 Propose a New Source

Know a reliable, public BitTorrent tracker list we are missing?

- 🚀 [Open a Feature Request](https://github.com/mrgusux/automatic-trackers/issues/new?template=feature_request.yml)
- 💬 [Start a Discussion](https://github.com/mrgusux/automatic-trackers/discussions)

A good source candidate should be: publicly accessible, plain-text (one tracker per line), and actively maintained.
