# 🚀 Ultimate Torrent Tracker Aggregator

Welcome to the **Ultimate Torrent Tracker Aggregator**! This repository automatically fetches, cleans, deduplicates, and categorizes torrent trackers from 83+ top-tier internet sources. 

The tracker lists are automatically updated **every 6 hours** using GitHub Actions to ensure maximum download speed and connectivity for your torrents.

---

## 📋 Tracker Lists (Raw Links)

Copy the link of the format you need and paste it into your torrent client (e.g., qBittorrent, Transmission, Deluge).

* 🌟 **All Trackers (Recommended):**
  `https://raw.githubusercontent.com/mrgusux/automatic-trackers/main/all_trackers.txt`

* 🚀 **UDP Trackers Only:**
  `https://raw.githubusercontent.com/mrgusux/automatic-trackers/main/udp.txt`

* 🔒 **HTTPS Trackers Only:**
  `https://raw.githubusercontent.com/mrgusux/automatic-trackers/main/https.txt`

* 🌐 **HTTP Trackers Only:**
  `https://raw.githubusercontent.com/mrgusux/automatic-trackers/main/http.txt`

* 🧲 **Comma-Separated (For Magnet Links):**
  `https://raw.githubusercontent.com/mrgusux/automatic-trackers/main/all_trackers_comma.txt`

---

## ✨ Advanced Features

* **Massive Source Database:** Sequentially fetches from 83 highly reliable sources without missing any data.
* **Strict Cleaning:** Automatically removes Cloudflare blocks, dead HTML pages, localhost IPs, and invalid formats.
* **Protocol Priority:** Trackers are sorted to maximize speed (UDP > HTTPS > HTTP > WS).
* **Format Optimized:** Perfectly formatted with empty lines between trackers for optimal qBittorrent performance.
* **Data Loss Prevention:** Built-in fail-safes prevent the list from updating if a major network failure occurs.

---

## ⚙️ How to use in qBittorrent

1. Open **qBittorrent**.
2. Go to `Tools` > `Options` (or `Preferences`).
3. Click on the `BitTorrent` tab on the left.
4. Check the box for **"Automatically add these trackers to new downloads"**.
5. Paste the **"All Trackers"** Raw Link from above into the empty box.
6. Click **Apply** and **OK**. 

That's it! Your torrents will now automatically use this always-updated tracker list.
