#!/usr/bin/env bash
# =============================================================================
# Ultimate Torrent Tracker Aggregator - Standalone Engine
#
# Fetches tracker lists from config/sources.txt, sanitizes them, removes
# everything found in the blacklist (built from config/blacklist_sources.txt),
# and writes the final lists + JSON APIs + checksums to $OUTPUT_DIR.
#
# Usage:
#   bash scripts/update_trackers.sh          # local run (outputs to repo root)
#   make run                                 # same, via Makefile
#   docker compose up --build                # containerized run
#
# Tunables (environment variables, all optional):
#   OUTPUT_DIR          Where output files are written  (default: repo root)
#   CACHE_DIR           Fetch fallback cache directory  (default: /tmp/tracker_cache)
#   MIN_TRACKER_COUNT   Abort if fewer trackers found   (default: 150)
#   DROP_GUARD_PERCENT  Abort if list shrinks below N%  (default: 60)
#   TIMEOUT_SECONDS     Per-request max time            (default: 15)
#   CONNECT_TIMEOUT     Per-request connect timeout     (default: 8)
#   MAX_PARALLEL_JOBS   Parallel fetch workers          (default: 8)
#   RETRY_ATTEMPTS      Retries per source              (default: 3)
#   FORCE_FETCH         'true' = ignore cache fallback  (default: false)
#   DEBUG_MODE          'true' = verbose debug output   (default: false)
#
# NOTE: tests/tracker_test.bats mirrors sanitize_stream() and the blacklist
# filter below. If you change them here, update the tests to match.
# =============================================================================

set -euo pipefail
export LC_ALL=C

# ── Locate repository root (script works from any working directory) ──
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

# ── Configuration (env-overridable) ──
CONFIG_DIR="${CONFIG_DIR:-${REPO_ROOT}/config}"
SOURCES_FILE="${SOURCES_FILE:-${CONFIG_DIR}/sources.txt}"
BLACKLIST_SOURCES_FILE="${BLACKLIST_SOURCES_FILE:-${CONFIG_DIR}/blacklist_sources.txt}"
OUTPUT_DIR="${OUTPUT_DIR:-${REPO_ROOT}}"
CACHE_DIR="${CACHE_DIR:-/tmp/tracker_cache}"
MIN_TRACKER_COUNT="${MIN_TRACKER_COUNT:-150}"
DROP_GUARD_PERCENT="${DROP_GUARD_PERCENT:-60}"
TIMEOUT_SECONDS="${TIMEOUT_SECONDS:-15}"
CONNECT_TIMEOUT="${CONNECT_TIMEOUT:-8}"
MAX_PARALLEL_JOBS="${MAX_PARALLEL_JOBS:-8}"
RETRY_ATTEMPTS="${RETRY_ATTEMPTS:-3}"
FORCE_FETCH="${FORCE_FETCH:-false}"
DEBUG_MODE="${DEBUG_MODE:-false}"

# ── Dependency check (fail fast with a clear message) ──
for dep in curl jq awk sed grep sort shuf xargs sha256sum; do
  if ! command -v "${dep}" > /dev/null 2>&1; then
    echo "ERROR: required dependency '${dep}' not found in PATH." >&2
    exit 1
  fi
done

# ── Config files must exist ──
for cfg in "${SOURCES_FILE}" "${BLACKLIST_SOURCES_FILE}"; do
  if [ ! -f "${cfg}" ]; then
    echo "ERROR: config file not found: ${cfg}" >&2
    exit 1
  fi
done

START_TS="$(date +%s)"
WORK_DIR="$(mktemp -d)"
PARALLEL_DIR="${WORK_DIR}/parallel"
STATUS_DIR="${WORK_DIR}/status"
FAILED_LOG="${WORK_DIR}/failed_sources.log"
UA_FILE="${WORK_DIR}/user_agents.txt"

mkdir -p "${PARALLEL_DIR}" "${STATUS_DIR}" "${CACHE_DIR}" "${OUTPUT_DIR}/api"
touch "${FAILED_LOG}"
trap '[ -d "${WORK_DIR}" ] && rm -rf "${WORK_DIR}"' EXIT

# ── Load source lists from config (ignore comments and blank lines) ──
mapfile -t SOURCES < <(grep -vE '^[[:space:]]*(#|$)' "${SOURCES_FILE}" | sed 's/[[:space:]]*$//')
mapfile -t BLACKLIST_SOURCES < <(grep -vE '^[[:space:]]*(#|$)' "${BLACKLIST_SOURCES_FILE}" | sed 's/[[:space:]]*$//')

TOTAL_SOURCES="${#SOURCES[@]}"

if [ "${TOTAL_SOURCES}" -eq 0 ]; then
  echo "ERROR: no source URLs found in ${SOURCES_FILE}" >&2
  exit 1
fi

# ── Config validation: no duplicates, http(s):// only ──
DUPES="$(printf '%s\n' "${SOURCES[@]}" | sort | uniq -d)"
if [ -n "${DUPES}" ]; then
  echo "ERROR: duplicate source URLs found:" >&2
  echo "${DUPES}" >&2
  exit 1
fi
if printf '%s\n' "${SOURCES[@]}" "${BLACKLIST_SOURCES[@]}" | grep -vqE '^https?://'; then
  echo "ERROR: invalid (non-http/https) source URL detected." >&2
  exit 1
fi
echo "✓ Config valid: ${TOTAL_SOURCES} unique sources, ${#BLACKLIST_SOURCES[@]} blacklist sources"

# ── Rotating User-Agent pool ──
cat > "${UA_FILE}" << 'UAEOF'
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36
Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15
Mozilla/5.0 (X11; Linux x86_64; rv:125.0) Gecko/20100101 Firefox/125.0
UAEOF

export PARALLEL_DIR STATUS_DIR CACHE_DIR UA_FILE FAILED_LOG
export TIMEOUT_SECONDS CONNECT_TIMEOUT RETRY_ATTEMPTS DEBUG_MODE FORCE_FETCH

debug_log() {
  if [ "${DEBUG_MODE}" = "true" ]; then
    echo "[DEBUG] $*" >&2
  fi
}

# Fetch one source. Fresh fetch FIRST; cached copy only as FALLBACK.
fetch_source() {
  local idx="$1"
  local url="$2"
  local out="${PARALLEL_DIR}/source_${idx}.txt"
  local cache_file="${CACHE_DIR}/source_${idx}.cache"
  local attempt=0
  local delay=1
  local ua size

  while [ "${attempt}" -lt "${RETRY_ATTEMPTS}" ]; do
    ua="$(shuf -n1 "${UA_FILE}")"

    if timeout $((TIMEOUT_SECONDS + 5)) curl -sSfL \
      --http1.1 --tlsv1.2 --compressed \
      --max-time "${TIMEOUT_SECONDS}" \
      --connect-timeout "${CONNECT_TIMEOUT}" \
      --speed-limit 500 \
      --speed-time 10 \
      -A "${ua}" \
      -H "Accept: text/plain,application/json" \
      -H "Cache-Control: no-cache" \
      "${url}" -o "${out}" 2> /dev/null; then

      size="$(wc -c < "${out}" 2> /dev/null || echo 0)"

      if [ "${size}" -ge 10 ] && ! grep -qiE '^<|<!doctype|<html' "${out}" 2> /dev/null; then
        cp "${out}" "${cache_file}"
        echo "OK" > "${STATUS_DIR}/${idx}"
        echo "[src $((idx + 1))] OK       ${url}"
        return 0
      fi
      rm -f "${out}"
    fi

    attempt=$((attempt + 1))
    if [ "${attempt}" -lt "${RETRY_ATTEMPTS}" ]; then
      debug_log "Retry ${attempt}/${RETRY_ATTEMPTS} for source ${idx} after ${delay}s"
      sleep "${delay}"
      delay=$((delay * 2))
    fi
  done

  # Network failed - fall back to last known-good cached copy
  if [ "${FORCE_FETCH}" != "true" ] && [ -s "${cache_file}" ]; then
    cp "${cache_file}" "${out}"
    echo "CACHED" > "${STATUS_DIR}/${idx}"
    echo "[src $((idx + 1))] CACHED   ${url}"
    return 0
  fi

  echo "${url}" >> "${FAILED_LOG}"
  echo "FAILED" > "${STATUS_DIR}/${idx}"
  echo "[src $((idx + 1))] FAILED   ${url}"
  return 0
}
export -f fetch_source debug_log

echo ""
echo "Starting PARALLEL aggregation of ${TOTAL_SOURCES} sources (jobs: ${MAX_PARALLEL_JOBS})..."
echo "Configuration: force_fetch=${FORCE_FETCH}, debug=${DEBUG_MODE}, output=${OUTPUT_DIR}"
echo ""

for idx in "${!SOURCES[@]}"; do
  printf '%s %s\n' "${idx}" "${SOURCES[$idx]}"
done | xargs -P "${MAX_PARALLEL_JOBS}" -L1 bash -c 'fetch_source "$1" "$2"' _

SUCCESS_COUNT="$(cat "${STATUS_DIR}"/* 2> /dev/null | grep -cx 'OK' || true)"
CACHED_COUNT="$(cat "${STATUS_DIR}"/* 2> /dev/null | grep -cx 'CACHED' || true)"
FAIL_COUNT="$(cat "${STATUS_DIR}"/* 2> /dev/null | grep -cx 'FAILED' || true)"
OK_TOTAL=$((SUCCESS_COUNT + CACHED_COUNT))

echo ""
echo "Fetch Summary: ${SUCCESS_COUNT} OK, ${CACHED_COUNT} CACHED (fallback), ${FAIL_COUNT} FAILED"

# ──────────────────────────────────────────────────────────────────────
# Shared sanitizer used for trackers AND blacklist entries.
# Mirrored in tests/tracker_test.bats - keep both in sync!
# ──────────────────────────────────────────────────────────────────────
sanitize_stream() {
  sed '1s/^\xEF\xBB\xBF//' | \
  tr -d '\r\0"' | \
  tr ',' '\n' | \
  LC_ALL=C sed 's/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]//g' | \
  sed 's/<[^>]*>//g' | \
  sed 's/^[[:space:]]*//; s/[[:space:]]*$//' | \
  grep -iE '^(udp|https?|wss?)://[^[:space:]]+$' | \
  grep -vE '://.*://' | \
  grep -viE '/announce\+' | \
  sed -E 's|([^:/])//+|\1/|g' | \
  sed 's|/*$||' | \
  awk -F'://' '{
    scheme = tolower($1)
    rest = substr($0, length($1) + 4)
    slash = index(rest, "/")
    if (slash > 0) { host = substr(rest, 1, slash - 1); path = substr(rest, slash) }
    else           { host = rest; path = "" }
    print scheme "://" tolower(host) path
  }' | \
  grep -viE '^[a-z]+://(localhost|127\.|0\.0\.0\.0|255\.255\.255\.255|\[?::1)' | \
  grep -viE '^[a-z]+://(10\.|192\.168\.|172\.1[6-9]\.|172\.2[0-9]\.|172\.3[0-1]\.|169\.254\.)' | \
  grep -viE '(example\.(com|org|net)|\.local([:/]|$)|\.onion([:/]|$)|\.internal([:/]|$)|nonexistent)' | \
  sort -u
}

# ── Merge raw sources ──
find "${PARALLEL_DIR}" -name "source_*.txt" -type f -exec cat {} + 2> /dev/null | sort -u > "${WORK_DIR}/raw.txt" || true
RAW_COUNT="$(wc -l < "${WORK_DIR}/raw.txt" 2> /dev/null || echo 0)"
echo "Raw lines: ${RAW_COUNT}"

if [ ! -s "${WORK_DIR}/raw.txt" ] || [ "${RAW_COUNT}" -lt 5 ]; then
  echo "ERROR: insufficient data (${RAW_COUNT} lines)" >&2
  exit 1
fi

echo "Sanitizing trackers..."
sanitize_stream < "${WORK_DIR}/raw.txt" > "${WORK_DIR}/clean_pre.txt" || true
PRE_BL_COUNT="$(wc -l < "${WORK_DIR}/clean_pre.txt" 2> /dev/null || echo 0)"
echo "Sanitized trackers (pre-blacklist): ${PRE_BL_COUNT}"

# ──────────────────────────────────────────────────────────────────────
# BLACKLIST: fetch -> merge with existing blacklist.txt -> filter
# ──────────────────────────────────────────────────────────────────────
echo "Building blacklist..."
BL_RAW="${WORK_DIR}/blacklist_raw.txt"
BL_FILE="${OUTPUT_DIR}/blacklist.txt"
: > "${BL_RAW}"
# Start from the previously committed blacklist (accumulative)
[ -f "${BL_FILE}" ] && cat "${BL_FILE}" >> "${BL_RAW}"
for bl_url in "${BLACKLIST_SOURCES[@]}"; do
  if curl -sSfL --max-time "${TIMEOUT_SECONDS}" --connect-timeout "${CONNECT_TIMEOUT}" \
       "${bl_url}" >> "${BL_RAW}" 2> /dev/null; then
    echo "  ✓ blacklist source: ${bl_url}"
  else
    echo "  ⚠ blacklist source unreachable (skipped): ${bl_url}"
  fi
  echo "" >> "${BL_RAW}"
done

sanitize_stream < "${BL_RAW}" > "${BL_FILE}" || true
BL_COUNT="$(wc -l < "${BL_FILE}" 2> /dev/null || echo 0)"
echo "Blacklist entries: ${BL_COUNT}"

# Filter: drop any tracker whose host:port appears in the blacklist.
# Mirrored in tests/tracker_test.bats - keep both in sync!
if [ -s "${BL_FILE}" ]; then
  awk -F'://' '
    NR == FNR { rest = substr($0, length($1) + 4); sub(/\/.*/, "", rest); bad[rest] = 1; badurl[$0] = 1; next }
    {
      rest = substr($0, length($1) + 4); sub(/\/.*/, "", rest)
      if (!($0 in badurl) && !(rest in bad)) print
    }
  ' "${BL_FILE}" "${WORK_DIR}/clean_pre.txt" > "${WORK_DIR}/clean.txt"
else
  cp "${WORK_DIR}/clean_pre.txt" "${WORK_DIR}/clean.txt"
fi

CLEAN_COUNT="$(wc -l < "${WORK_DIR}/clean.txt" 2> /dev/null || echo 0)"
BL_REMOVED=$((PRE_BL_COUNT - CLEAN_COUNT))
echo "Clean trackers: ${CLEAN_COUNT} (blacklist removed: ${BL_REMOVED})"

# ── Categorize ──
grep -E '^udp://'   "${WORK_DIR}/clean.txt" > "${WORK_DIR}/udp.txt"   2> /dev/null || touch "${WORK_DIR}/udp.txt"
grep -E '^https://' "${WORK_DIR}/clean.txt" > "${WORK_DIR}/https.txt" 2> /dev/null || touch "${WORK_DIR}/https.txt"
grep -E '^http://'  "${WORK_DIR}/clean.txt" > "${WORK_DIR}/http.txt"  2> /dev/null || touch "${WORK_DIR}/http.txt"
grep -E '^wss?://'  "${WORK_DIR}/clean.txt" > "${WORK_DIR}/ws.txt"    2> /dev/null || touch "${WORK_DIR}/ws.txt"

# ── Sort by protocol priority: udp -> https -> http -> ws ──
awk '
  /^udp:\/\//   {print "1\t" $0; next}
  /^https:\/\// {print "2\t" $0; next}
  /^http:\/\//  {print "3\t" $0; next}
  /^wss?:\/\//  {print "4\t" $0; next}
' "${WORK_DIR}/clean.txt" | sort -t$'\t' -k1,1n -k2,2 | cut -f2- > "${WORK_DIR}/sorted.txt"

FINAL_COUNT="$(wc -l < "${WORK_DIR}/sorted.txt" 2> /dev/null || echo 0)"
echo "Final trackers: ${FINAL_COUNT}"

# ── Safety guards (BEFORE overwriting anything) ──
if [ "${FINAL_COUNT}" -lt "${MIN_TRACKER_COUNT}" ]; then
  echo "ERROR: only ${FINAL_COUNT} trackers found (minimum: ${MIN_TRACKER_COUNT}). Aborting to protect existing lists." >&2
  exit 1
fi
PREV_COUNT="$(grep -c '^[a-z]' "${OUTPUT_DIR}/all_trackers.txt" 2> /dev/null || echo 0)"
if [ "${PREV_COUNT}" -gt 0 ]; then
  THRESHOLD=$((PREV_COUNT * DROP_GUARD_PERCENT / 100))
  if [ "${FINAL_COUNT}" -lt "${THRESHOLD}" ]; then
    echo "ERROR: new list (${FINAL_COUNT}) dropped below ${DROP_GUARD_PERCENT}% of previous (${PREV_COUNT}). Possible mass source failure. Aborting." >&2
    exit 1
  fi
fi

# ── Write output files (blank-line separated, aria2 friendly) ──
format_output() {
  local src="$1" dst="$2"
  if [ -s "${src}" ]; then
    awk 'NR>1{print ""} {print}' "${src}" > "${dst}"
  else
    : > "${dst}"
  fi
}
format_output "${WORK_DIR}/sorted.txt" "${OUTPUT_DIR}/all_trackers.txt"
format_output "${WORK_DIR}/udp.txt"    "${OUTPUT_DIR}/udp.txt"
format_output "${WORK_DIR}/https.txt"  "${OUTPUT_DIR}/https.txt"
format_output "${WORK_DIR}/http.txt"   "${OUTPUT_DIR}/http.txt"
format_output "${WORK_DIR}/ws.txt"     "${OUTPUT_DIR}/ws.txt"
paste -sd ',' "${WORK_DIR}/sorted.txt" > "${OUTPUT_DIR}/all_trackers_comma.txt" 2> /dev/null || : > "${OUTPUT_DIR}/all_trackers_comma.txt"
# Keep the legacy trackers.txt in sync (users may hotlink it)
cp "${OUTPUT_DIR}/all_trackers.txt" "${OUTPUT_DIR}/trackers.txt"

# ── JSON APIs (built with jq = always valid JSON) ──
UDP_COUNT="$(grep -c '^udp://' "${WORK_DIR}/sorted.txt" 2> /dev/null || echo 0)"
HTTPS_COUNT="$(grep -c '^https://' "${WORK_DIR}/sorted.txt" 2> /dev/null || echo 0)"
HTTP_COUNT="$(grep -c '^http://' "${WORK_DIR}/sorted.txt" 2> /dev/null || echo 0)"
WS_COUNT="$(grep -cE '^wss?://' "${WORK_DIR}/sorted.txt" 2> /dev/null || echo 0)"
SUCCESS_RATE="$(awk -v ok="${OK_TOTAL}" -v total="${TOTAL_SOURCES}" 'BEGIN {if (total > 0) printf "%.2f", (ok*100)/total; else print "0.00"}')"

jq -n \
  --arg updated "$(date -Iseconds)" \
  --arg rate "${SUCCESS_RATE}%" \
  --argjson total "${FINAL_COUNT}" \
  --argjson sources "${TOTAL_SOURCES}" \
  --argjson blacklisted "${BL_REMOVED}" \
  --argjson udp "${UDP_COUNT}" --argjson https "${HTTPS_COUNT}" \
  --argjson http "${HTTP_COUNT}" --argjson ws "${WS_COUNT}" \
  '{version: "1.1", updated_at: $updated, total: $total, sources: $sources,
    success_rate: $rate, blacklist_removed: $blacklisted,
    protocols: {udp: $udp, https: $https, http: $http, ws: $ws}}' > "${OUTPUT_DIR}/api/stats.json"

jq -n --arg msg "${FINAL_COUNT}" \
  '{schemaVersion: 1, label: "Trackers", message: $msg, color: "brightgreen"}' > "${OUTPUT_DIR}/api/badge.json"

jq -Rn --arg gen "$(date -Iseconds)" --argjson total "${FINAL_COUNT}" \
  '{version: "1.1", generated: $gen, total: $total, trackers: [inputs]}' \
  < "${WORK_DIR}/sorted.txt" > "${OUTPUT_DIR}/api/trackers.json"

# ── Regenerate SHA256SUMS.txt (always in sync with the lists) ──
(
  cd "${OUTPUT_DIR}"
  mapfile -t txt_files < <(find . -maxdepth 1 -type f -name '*.txt' ! -name 'SHA256SUMS.txt' -printf '%P\n' | sort)
  sha256sum "${txt_files[@]}" > SHA256SUMS.txt
)

# ── Idempotency (covers trackers AND blacklist changes) ──
NEW_HASH="$(sha256sum "${OUTPUT_DIR}/all_trackers.txt" "${BL_FILE}" | sha256sum | cut -d' ' -f1)"
OLD_HASH="$(cat "${OUTPUT_DIR}/.tracker_hash" 2> /dev/null || echo "")"
echo "${NEW_HASH}" > "${OUTPUT_DIR}/.tracker_hash"

SKIP_COMMIT="false"
if [ "${NEW_HASH}" = "${OLD_HASH}" ]; then
  SKIP_COMMIT="true"
  echo "ℹ No changes detected - commit will be skipped."
fi

# ── CI outputs (only when running inside GitHub Actions) ──
if [ -n "${GITHUB_OUTPUT:-}" ]; then
  {
    echo "skip_commit=${SKIP_COMMIT}"
    echo "tracker_count=${FINAL_COUNT}"
    echo "source_count=${TOTAL_SOURCES}"
  } >> "${GITHUB_OUTPUT}"
fi

# ── Report (job summary in CI, stdout locally) ──
ELAPSED=$(($(date +%s) - START_TS))
REPORT="$(
  echo "## Aggregation Report"
  echo "| Key | Value |"
  echo "|-----|-------|"
  echo "| Total Sources | ${TOTAL_SOURCES} |"
  echo "| Successful (fresh) | ${SUCCESS_COUNT} |"
  echo "| Cached fallback | ${CACHED_COUNT} |"
  echo "| Failed | ${FAIL_COUNT} |"
  echo "| Success Rate | ${SUCCESS_RATE}% |"
  echo "| Blacklist entries | ${BL_COUNT} |"
  echo "| Removed by blacklist | ${BL_REMOVED} |"
  echo "| Final Trackers | ${FINAL_COUNT} |"
  echo "| UDP / HTTPS / HTTP / WS | ${UDP_COUNT} / ${HTTPS_COUNT} / ${HTTP_COUNT} / ${WS_COUNT} |"
  echo "| Time | ${ELAPSED}s |"
  if [ -s "${FAILED_LOG}" ]; then
    echo ""
    echo "<details><summary>Failed sources (${FAIL_COUNT})</summary>"
    echo ""
    sed 's/^/- /' "${FAILED_LOG}"
    echo ""
    echo "</details>"
  fi
)"

if [ -n "${GITHUB_STEP_SUMMARY:-}" ]; then
  echo "${REPORT}" >> "${GITHUB_STEP_SUMMARY}"
else
  echo ""
  echo "${REPORT}"
fi

echo ""
echo "✅ Done: ${FINAL_COUNT} trackers written to ${OUTPUT_DIR}"
