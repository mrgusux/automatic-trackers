# 🌐 Tracker Sources Directory

Transparency and data integrity are the core principles of the **Ultimate Torrent Tracker Aggregator Pro Max**. This document outlines the origins of the 98 highly-reputable tracker sources used in our strict 12-stage sanitization pipeline.

## 📊 Source Breakdown

Our automated fetching engine pulls raw data from a combination of the most trusted open-source repositories and live tracker APIs. 

### 1. Primary Repositories (GitHub)
We aggregate data from the following major tracker collections:
- [ngosang/trackerslist](https://github.com/ngosang/trackerslist) (Multiple variants: all, best, udp, http, ws)
- [XIU2/TrackersListCollection](https://github.com/XIU2/TrackersListCollection) (Multiple variants)
- [DeSireFire/animeTrackerList](https://github.com/DeSireFire/animeTrackerList)
- [hezhijie0327/Trackerslist](https://github.com/hezhijie0327/Trackerslist)
- [Naunter/BT_Trackers](https://github.com/Naunter/BT_Trackers)

### 2. Live APIs & Trackers
Real-time active tracker data is fetched via:
- **NewTrackon API**: `https://newtrackon.com/api/` (all, stable, live, udp, http)
- **OpenTracker**: `https://opentracker.cc/`

### 3. Specialized & Curated Lists
- **Blocklists / Blacklists**: To ensure we only keep valid trackers, some blocklists are referenced for cross-checking (e.g., `crazy-max/blocklist`).
- **Anime Trackers**: Dedicated sources for ACG/Anime content (`acgtracker/public-trackers`).
- **IP-Only Trackers**: High-performance IP-based trackers without domain resolution overhead.

### 4. Advanced "Minimax + v0" Sources
Recently, 15 new ultra-reliable sources were added to ensure maximum swarm connectivity. These include:
- `HDVinnie/open-tracker-list`
- `anthonyfok/trackerslist-mirror`
- `duckbytes/trackerslist`
- Specialized `IPv4-only` APIs.

---

## 🤝 Propose a New Source
Do you know a highly reliable, public BitTorrent tracker list that we are missing? 
Please submit an issue using our [Feature Request Template](.github/ISSUE_TEMPLATE/feature_request.yml) or open a discussion!

*Note: All sources are subjected to our automated 12-stage sanitization pipeline to remove dead, malicious, or private IP addresses (RFC-1918).*
