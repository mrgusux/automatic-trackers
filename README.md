<div align="center">
  <img src="og-image.png" alt="Automatic Trackers Banner" width="100%" />
  
  # 🚀 Automatic Trackers
  
  **A frequently updated, automatically sanitized, and carefully curated list of BitTorrent Trackers.**
  
  [![Update Trackers](https://github.com/mrgusux/automatic-trackers/actions/workflows/update-trackers.yml/badge.svg)](https://github.com/mrgusux/automatic-trackers/actions)
  [![Security Scorecard](https://api.securityscorecards.dev/projects/github.com/mrgusux/automatic-trackers/badge)](https://securityscorecards.dev/viewer/?uri=github.com/mrgusux/automatic-trackers)
  [![Trackers Status](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/mrgusux/automatic-trackers/main/api/badge.json&label=Active%20Trackers&color=brightgreen)](https://github.com/mrgusux/automatic-trackers)
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

  [Read the Documentation](https://mrgusux.github.io/automatic-trackers) • [Report a Bug](../../issues) • [Request a Feature](../../issues)
</div>

---

## 🌟 Why This List?

Finding reliable and active BitTorrent trackers can be a hassle. This repository solves that by utilizing automated GitHub Actions to scrape, verify, sanitize, and update a massive list of trackers.

- **⏱️ Always Fresh:** Automated workflows check for dead or slow trackers and update the lists **every 6 hours**.
- **🛡️ Sanitized:** Malicious, fake, or honeypot trackers are strictly filtered out via a 12-stage enterprise pipeline.
- **🔌 API Ready:** Developer-friendly JSON endpoints are available for seamless app integration.
- **🐳 Docker Support:** Easy local deployment using Docker and Docker Compose.

## 📋 Tracker Lists (Raw Links)

You can directly add these raw links to your torrent client (e.g., qBittorrent, Transmission, Aria2) to automatically fetch trackers:

* 🔥 **[All Trackers (Best)](https://raw.githubusercontent.com/mrgusux/automatic-trackers/main/all_trackers.txt)** - The complete, sanitized list of all active trackers.
* 🌐 **[HTTPS Trackers](https://raw.githubusercontent.com/mrgusux/automatic-trackers/main/https.txt)** - HTTPS-based trackers only (secure & web-based).
* 🟢 **[HTTP Trackers](https://raw.githubusercontent.com/mrgusux/automatic-trackers/main/http.txt)** - HTTP-based trackers only (legacy support).
* ⚡ **[UDP Trackers](https://raw.githubusercontent.com/mrgusux/automatic-trackers/main/udp.txt)** - Fast, low-overhead UDP trackers.
* 🕸️ **[WebSocket Trackers (WS)](https://raw.githubusercontent.com/mrgusux/automatic-trackers/main/ws.txt)** - WebTorrent compatible trackers.

## 💻 Developer API (Machine-Readable)

Building an app or tool? We provide pure JSON outputs that are automatically updated alongside the raw lists:

- **Full Trackers API:** [`/api/trackers.json`](https://raw.githubusercontent.com/mrgusux/automatic-trackers/main/api/trackers.json) - Complete list as JSON array
- **Health & Statistics:** [`/api/stats.json`](https://raw.githubusercontent.com/mrgusux/automatic-trackers/main/api/stats.json) - Protocol breakdown and success rates
- **Status Badge:** [`/api/badge.json`](https://raw.githubusercontent.com/mrgusux/automatic-trackers/main/api/badge.json) - For dynamic shields.io badges

## 🔄 Update Schedule & Manual Trigger

This project automatically updates **every 6 hours** via GitHub Actions. No manual intervention is required!

| Trigger | Schedule | Details |
|---------|----------|---------|
| **Automated** | Every 6 hours (0:00, 6:00, 12:00, 18:00 UTC) | Scheduled via cron: `0 */6 * * *` |
| **Manual** | On-demand | Use [GitHub Actions > Update Trackers > Run workflow](../../actions/workflows/update-trackers.yml) |

Each run:
- ✅ Fetches from **98 highly-reputable sources**
- 🧹 Runs **12-stage sanitization pipeline**
- 📊 Generates categorized tracker files (UDP, HTTPS, HTTP, WebSocket)
- 💾 Auto-commits changes only if data differs (idempotency check)

## 🐳 Quick Start (Docker)

If you want to run the tracking and sanitizing scripts locally, you can use Docker.

```bash
# Clone the repository
git clone https://github.com/mrgusux/automatic-trackers.git
cd automatic-trackers

# Run via Docker Compose (creates output directory automatically)
docker-compose up -d

# View logs
docker-compose logs -f automatic-trackers

# Stop the container
docker-compose down
```

### Manual Update (One-Time Run)

```bash
# Build the Docker image
docker build -t automatic-trackers:latest .

# Run once (outputs to current directory)
docker run --rm -v $(PWD):/app automatic-trackers:latest
```

## 📊 Data Quality Metrics

Our 12-stage sanitization pipeline ensures:
- ✅ **No private IPs** (RFC-1918: 10.x, 192.168.x, 172.16-31.x)
- ✅ **No localhost/loopback** (127.x, 0.0.0.0, ::1)
- ✅ **Valid protocols only** (UDP, HTTP, HTTPS, WebSocket)
- ✅ **Uniqueness enforced** (deduplication via SHA256)
- ✅ **No HTML/Cloudflare blocks** (intelligent detection)
- ✅ **Proper encoding** (BOM/CR character removal)

## 🤝 Contributing

Contributions make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Please read our [Code of Conduct](CODE_OF_CONDUCT.md) first.
2. Fork the Project.
3. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
4. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
5. Push to the Branch (`git push origin feature/AmazingFeature`).
6. Open a Pull Request.

*See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.*

## 📁 Project Structure

```
automatic-trackers/
├── .github/
│   ├── workflows/
│   │   ├── update-trackers.yml      # Main 6-hourly fetching & sanitization
│   │   ├── lint.yml                  # ShellCheck for code quality
│   │   ├── release.yml               # Automated releases
│   │   └── ...
│   ├── labeler.yml                   # PR auto-labeling
│   └── ISSUE_TEMPLATE/
├── api/                              # Auto-generated JSON endpoints
│   ├── trackers.json                 # All trackers as JSON array
│   ├── stats.json                    # Statistics & metrics
│   └── badge.json                    # Dynamic badge data
├── tests/                            # Test suite (planned)
├── docs/                             # Documentation (planned)
├── all_trackers.txt                  # Master list (qBittorrent format)
├── all_trackers_comma.txt            # Comma-separated format
├── udp.txt, https.txt, http.txt, ws.txt  # Protocol-specific lists
├── Dockerfile                        # Container runtime
├── docker-compose.yml                # Local development setup
├── Makefile                          # Build automation
├── README.md                         # This file
└── SOURCES.md                        # Source documentation
```

## 📜 License & Governance

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

This project follows an open [Governance Model](GOVERNANCE.md) to ensure transparent decision-making.

## 🙏 Acknowledgments

This project aggregates data from 98 top-tier open-source tracker repositories and live APIs. Special thanks to:
- [ngosang](https://github.com/ngosang/trackerslist)
- [XIU2](https://github.com/XIU2/TrackersListCollection)
- [newtrackon.com](https://newtrackon.com/) API
- All community contributors

---
<div align="center">
  <b>Crafted with ❤️ by the Open Source Community</b><br/>
  <sub>Updated automatically every 6 hours via GitHub Actions</sub>
</div>
