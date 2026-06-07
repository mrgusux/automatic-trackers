# 🏛️ System Architecture

Welcome to the architectural overview of the **Ultimate Torrent Tracker Aggregator Pro Max**. This document visualizes how our GitHub Actions pipeline fetches, sanitizes, and distributes the trackers.

## 🔄 The Pipeline Flow

Below is the automated workflow that runs every 6 hours:

```mermaid
graph TD
    A[98 Global Tracker Sources] -->|Triggered by Cron| B(GitHub Actions Runner)
    B --> C{Smart Fetching Engine}
    C -->|Exponential Backoff| D[Bypass WAF & Cloudflare]
    D --> E[Raw Text Aggregation]
    
    E --> F((12-Stage Sanitization))
    F --> G[Strip HTML / Error Pages]
    F --> H[Filter Local/Private IPs RFC-1918]
    F --> I[Remove Invalid Protocols]
    F --> J[Deduplicate Trackers]
    
    J --> K{Priority Sorting Engine}
    K -->|1| L[UDP Trackers]
    K -->|2| M[HTTPS Trackers]
    K -->|3| N[HTTP Trackers]
    K -->|4| O[WS/WSS Trackers]
    
    L & M & N & O --> P[Final Formatting]
    P --> Q{Idempotency Check}
    Q -->|Data Changed| R[Cryptographic Signing & Commit]
    Q -->|No Change| S[Skip Commit & Save Resources]
