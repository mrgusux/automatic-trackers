<div align="center">
  <img src="og-image.png" alt="Automatic Trackers Banner" width="100%" />
  
  # 🚀 Automatic Trackers
  
  **A frequently updated, automatically sanitized, and carefully curated list of BitTorrent Trackers.**
  
  [![Update Trackers](https://github.com/mrgusux/automatic-trackers/actions/workflows/update-trackers.yml/badge.svg)](https://github.com/mrgusux/automatic-trackers/actions)
  [![Security Scorecard](https://api.securityscorecards.dev/projects/github.com/mrgusux/automatic-trackers/badge)](https://securityscorecards.dev/viewer/?uri=github.com/mrgusux/automatic-trackers)
  [![Trackers Status](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/mrgusux/automatic-trackers/main/api/badge.json)](https://github.com/mrgusux/automatic-trackers/blob/main/api/stats.json)
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

  [Read the Documentation](https://mrgusux.github.io/automatic-trackers) • [Report a Bug](../../issues) • [Request a Feature](../../issues)
</div>

---

## 🌟 Why This List?

Finding reliable and active BitTorrent trackers can be a hassle. This repository solves that by utilizing automated GitHub Actions to scrape, verify, sanitize, and update a massive list of trackers daily.

- **⏱️ Always Fresh:** Automated workflows check for dead or slow trackers and update the lists.
- **🛡️ Sanitized:** Malicious, fake, or honeypot trackers are strictly filtered out.
- **🔌 API Ready:** Developer-friendly JSON endpoints are available for seamless app integration.
- **🐳 Docker Support:** Easy local deployment using Docker and Docker Compose.

## 📋 Tracker Lists (Raw Links)

You can directly add these raw links to your torrent client (e.g., qBittorrent, Transmission, Aria2) to automatically fetch trackers:

* 🔥 **[All Trackers (Best)](https://raw.githubusercontent.com/mrgusux/automatic-trackers/main/all_trackers.txt)** - The complete, sanitized list of all active trackers.
* 🌐 **[HTTP/HTTPS Trackers](https://raw.githubusercontent.com/mrgusux/automatic-trackers/main/https.txt)** - Web-based trackers only.
* ⚡ **[UDP Trackers](https://raw.githubusercontent.com/mrgusux/automatic-trackers/main/udp.txt)** - Fast, low-overhead UDP trackers.
* 🕸️ **[WebSocket Trackers (WS)](https://raw.githubusercontent.com/mrgusux/automatic-trackers/main/ws.txt)** - WebTorrent compatible trackers.

## 💻 Developer API (Machine-Readable)

Building an app or tool? We provide pure JSON outputs that are automatically updated alongside the raw lists:

- **Full Trackers API:** [`/api/trackers.json`](https://raw.githubusercontent.com/mrgusux/automatic-trackers/main/api/trackers.json)
- **Health & Statistics:** [`/api/stats.json`](https://raw.githubusercontent.com/mrgusux/automatic-trackers/main/api/stats.json)

## 🐳 Quick Start (Docker)

If you want to run the tracking and sanitizing scripts locally, you can use Docker.

```bash
# Clone the repository
git clone [https://github.com/mrgusux/automatic-trackers.git](https://github.com/mrgusux/automatic-trackers.git)
cd automatic-trackers

# Run via Docker Compose
docker-compose up -d
