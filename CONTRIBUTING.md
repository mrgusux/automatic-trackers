# 🤝 Contributing to Ultimate Torrent Tracker Aggregator

First off, thank you for considering a contribution! 🎉
Every kind of help is welcome: new tracker sources, pipeline improvements, documentation fixes, and bug reports.

Please also read our [Code of Conduct](CODE_OF_CONDUCT.md) and [Governance model](GOVERNANCE.md).

## 🌐 Adding a New Tracker Source

Tracker sources live in plain-text config files — **not** inside the workflow:

| File | What goes there |
| --- | --- |
| [`config/sources.txt`](config/sources.txt) | Public lists of **good** trackers (one URL per line) |
| [`config/blacklist_sources.txt`](config/blacklist_sources.txt) | Lists of **known-bad** trackers, used for exclusion filtering |

**Rules:**

1. Do **NOT** remove any existing URLs — removals require a maintainer decision (see [GOVERNANCE.md](GOVERNANCE.md)).
2. The source must be **publicly accessible**, **plain-text** (one tracker per line), and **actively maintained**.
3. Verify it yourself before submitting: `curl -sSfL <url> | head` should return tracker URLs, not HTML.
4. Add the URL under the matching comment section in the config file, then open a PR.

CI automatically rejects duplicate or malformed source URLs.

## 🧹 Improving the Sanitization Pipeline

All aggregation logic lives in a single place: [`scripts/update.sh`](scripts/update.sh).
If you know better `awk` / `sed` / `grep` techniques to catch bad payloads:

1. Modify the `sanitize_stream()` function in `scripts/update.sh`.
2. Add or update a test in [`tests/tracker_test.bats`](tests/tracker_test.bats) proving your improvement.
3. Make sure everything passes locally (see below).

## 🛠️ Development Setup

```bash
git clone https://github.com/mrgusux/automatic-trackers.git
cd automatic-trackers

make dev      # verify prerequisites (bash, curl, jq, shellcheck, bats)
make lint     # ShellCheck on scripts/
make test     # run the bats test suite
make run      # run the full aggregation locally
