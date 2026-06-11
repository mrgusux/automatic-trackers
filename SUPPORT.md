# 🆘 Support Guidelines

Need help with the **Ultimate Torrent Tracker Aggregator**? Use the right channel below to get the fastest possible answer.

## 📌 Where to Go

| I want to... | Go here |
|---|---|
| ❓ Ask a general question | [GitHub Discussions](https://github.com/mrgusux/automatic-trackers/discussions) |
| 💡 Share an idea | [Ideas Discussion](https://github.com/mrgusux/automatic-trackers/discussions/categories/ideas) |
| 🐛 Report a reproducible bug | [Open a Bug Report](https://github.com/mrgusux/automatic-trackers/issues/new?template=bug_report.yml) |
| 🚀 Request a feature or new tracker source | [Open a Feature Request](https://github.com/mrgusux/automatic-trackers/issues/new?template=feature_request.yml) |
| 🔒 Report a security vulnerability | See [SECURITY.md](SECURITY.md) — **never open a public issue for this** |
| 🤝 Contribute code | See [CONTRIBUTING.md](CONTRIBUTING.md) |

## ⚡ Quick Self-Help (Most Common Questions)

### How do I use the tracker list in my torrent client?

Copy the raw URL of the list you need and paste it into your client:

| List | Raw URL |
|---|---|
| All trackers (recommended) | `https://raw.githubusercontent.com/mrgusux/automatic-trackers/main/all_trackers.txt` |
| UDP only | `https://raw.githubusercontent.com/mrgusux/automatic-trackers/main/udp.txt` |
| HTTPS only | `https://raw.githubusercontent.com/mrgusux/automatic-trackers/main/https.txt` |
| HTTP only | `https://raw.githubusercontent.com/mrgusux/automatic-trackers/main/http.txt` |
| WebSocket only | `https://raw.githubusercontent.com/mrgusux/automatic-trackers/main/ws.txt` |
| Comma-separated (Aria2) | `https://raw.githubusercontent.com/mrgusux/automatic-trackers/main/all_trackers_comma.txt` |

- **qBittorrent:** Options → BitTorrent → check *"Automatically add these trackers to new downloads"* → paste the `all_trackers.txt` URL contents.
- **Aria2:** add `bt-tracker=` followed by the contents of `all_trackers_comma.txt` to your `aria2.conf`.
- **Transmission / Deluge:** add trackers per-torrent via the torrent's properties dialog.

### How often is the list updated?

Automatically **every 6 hours** via GitHub Actions. No manual action needed.

### A tracker in the list seems dead or malicious — what should I do?

Open a [Bug Report](https://github.com/mrgusux/automatic-trackers/issues/new?template=bug_report.yml) with the tracker URL. Known-bad trackers are filtered using `blacklist.txt`.

## 🕐 Response Expectations

This is a volunteer-maintained open source project. We aim to respond to issues and discussions within **a few days**, but there is no guaranteed SLA. Please be patient and respectful — see our [Code of Conduct](CODE_OF_CONDUCT.md).

## 🙏 Keep the Issue Tracker Clean

Please **do not** open issues for general tech support or "how do I" questions — use [Discussions](https://github.com/mrgusux/automatic-trackers/discussions) instead. This keeps the issue tracker focused on actual development work.
