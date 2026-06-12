# 🤝 Contributing to Ultimate Torrent Tracker Aggregator

First off, thank you for considering a contribution! 🎉
Every kind of help is welcome: new tracker sources, pipeline improvements, documentation fixes, and bug reports.

Please also read our [Code of Conduct](CODE_OF_CONDUCT.md) and [Governance model](GOVERNANCE.md).

## 🌐 Adding a New Tracker Source

Tracker sources currently live in two bash arrays inside the main workflow,
[`.github/workflows/update-trackers.yml`](.github/workflows/update-trackers.yml):

| Array | What goes there |
| --- | --- |
| `SOURCES` | Public lists of **good** trackers (one URL per line) |
| `BLACKLIST_SOURCES` | Lists of **known-bad** trackers, used for exclusion filtering |

> **Note:** extraction of these lists into standalone config files is planned
> (see the `Unreleased` section of [CHANGELOG.md](CHANGELOG.md)). This guide
> will be updated when that lands.

**Rules:**

1. Do **NOT** remove any existing URLs — removals require a maintainer decision (see [GOVERNANCE.md](GOVERNANCE.md)).
2. The source must be **publicly accessible**, **plain-text** (one tracker per line), and **actively maintained**.
3. Verify it yourself before submitting: `curl -sSfL <url> | head` should return tracker URLs, not HTML.
4. Add the URL to the matching array (good trackers at the end of `SOURCES`, blacklists in `BLACKLIST_SOURCES`), update [`SOURCES.md`](SOURCES.md) with attribution, then open a PR.

CI automatically rejects duplicate or malformed source URLs.

## 🧹 Improving the Sanitization Pipeline

The aggregation logic lives in the build step of
[`.github/workflows/update-trackers.yml`](.github/workflows/update-trackers.yml),
and the test suite keeps an exact mirror of it in
[`tests/tracker_test.bats`](tests/tracker_test.bats) (the `sanitize()` and
`bl_filter()` helpers).

If you know better `awk` / `sed` / `grep` techniques to catch bad payloads:

1. Modify the `sanitize_stream()` function in the workflow.
2. Update the matching `sanitize()` helper in `tests/tracker_test.bats` — **they must stay identical**.
3. Add or update a test proving your improvement.
4. Make sure everything passes locally (see below).

## 🛠️ Development Setup

```bash
git clone https://github.com/mrgusux/automatic-trackers.git
cd automatic-trackers

make dev      # verify prerequisites (bash, curl, jq, shellcheck, bats)
make lint     # ShellCheck on shell code
make test     # run the bats test suite
make run      # run the full aggregation locally
