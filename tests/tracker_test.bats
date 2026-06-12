#!/usr/bin/env bats
# =============================================================================
# Test suite for the tracker aggregation pipeline.
# Run from the repository root with:  bats tests/   (or `make test`)
#
# The sanitize() and bl_filter() helpers below replicate the EXACT logic of
# the pipeline in .github/workflows/update-trackers.yml. If you change the
# pipeline, update these helpers to match (and vice versa).
# =============================================================================

WORKFLOW=".github/workflows/update-trackers.yml"

# Mirror of sanitize_stream() from the workflow
sanitize() {
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

# Mirror of the blacklist exclusion filter from the workflow
bl_filter() {
  local bl="$1" in="$2"
  if [ -s "${bl}" ]; then
    awk -F'://' '
      NR == FNR { rest = substr($0, length($1) + 4); sub(/\/.*/, "", rest); bad[rest] = 1; badurl[$0] = 1; next }
      {
        rest = substr($0, length($1) + 4); sub(/\/.*/, "", rest)
        if (!($0 in badurl) && !(rest in bad)) print
      }
    ' "${bl}" "${in}"
  else
    cat "${in}"
  fi
}

setup() {
  TEST_DIR="$(mktemp -d)"

  # Realistic input fixture covering every pipeline rule
  INPUT="${TEST_DIR}/input.txt"
  cat > "${INPUT}" << 'EOF'
udp://tracker.opentrackr.org:1337/announce
udp://tracker.opentrackr.org:1337/announce
https://tracker.valid-host.net:443/announce
http://127.0.0.1:8080/announce
http://192.168.1.50:6969/announce
http://10.0.0.5:6969/announce
udp://tracker.example.com:80/announce
UDP://TRACKER.UPPERCASE.ORG:6969/announce
wss://ws.tracker-host.io:443/announce
udp://evil.tracker-host.com:1337/announce
not-a-tracker-line
ftp://wrong.protocol.org:21/announce
http://a.comma.host:80/announce,http://b.comma.host:80/announce
udp://http://double.scheme.host:6969/announce
udp://doubleslash.host:1337//announce
"http://quoted.host:80/announce"
http://glued.host:80/announcehttp://other.glued.host:80/announce
http://trailing.host:80/announce/
http://plusgarbage.host:80/announce+108
EOF

  BLACKLIST="${TEST_DIR}/blacklist.txt"
  echo "udp://evil.tracker-host.com:1337/announce" > "${BLACKLIST}"

  OUT="${TEST_DIR}/out.txt"
}

teardown() {
  rm -rf "${TEST_DIR}"
}

# ---------------------------------------------------------------------------
# Core sanitization rules
# ---------------------------------------------------------------------------

@test "duplicates are removed" {
  sanitize < "${INPUT}" > "${OUT}"
  count=$(grep -c "^udp://tracker.opentrackr.org:1337/announce$" "${OUT}")
  [ "${count}" -eq 1 ]
}

@test "only valid tracker protocols are kept" {
  sanitize < "${INPUT}" > "${OUT}"
  run grep "ftp://" "${OUT}"
  [ "${status}" -eq 1 ]
  run grep "not-a-tracker-line" "${OUT}"
  [ "${status}" -eq 1 ]
  run grep "wss://ws.tracker-host.io:443/announce" "${OUT}"
  [ "${status}" -eq 0 ]
}

@test "localhost addresses are filtered" {
  sanitize < "${INPUT}" > "${OUT}"
  run grep "127.0.0.1" "${OUT}"
  [ "${status}" -eq 1 ]
}

@test "private RFC-1918 addresses are filtered" {
  sanitize < "${INPUT}" > "${OUT}"
  run grep "192.168.1.50" "${OUT}"
  [ "${status}" -eq 1 ]
  run grep "10.0.0.5" "${OUT}"
  [ "${status}" -eq 1 ]
}

@test "reserved example domains are filtered" {
  sanitize < "${INPUT}" > "${OUT}"
  run grep "tracker.example.com" "${OUT}"
  [ "${status}" -eq 1 ]
}

@test "scheme and host are lowercased" {
  sanitize < "${INPUT}" > "${OUT}"
  run grep "udp://tracker.uppercase.org:6969/announce" "${OUT}"
  [ "${status}" -eq 0 ]
  run grep "UDP://TRACKER.UPPERCASE.ORG" "${OUT}"
  [ "${status}" -eq 1 ]
}

# ---------------------------------------------------------------------------
# Corrupted-data recovery rules
# ---------------------------------------------------------------------------

@test "comma-joined lines are split into individual trackers" {
  sanitize < "${INPUT}" > "${OUT}"
  run grep "^http://a.comma.host:80/announce$" "${OUT}"
  [ "${status}" -eq 0 ]
  run grep "^http://b.comma.host:80/announce$" "${OUT}"
  [ "${status}" -eq 0 ]
}

@test "double-scheme and glued URLs are dropped" {
  sanitize < "${INPUT}" > "${OUT}"
  run grep "double.scheme.host" "${OUT}"
  [ "${status}" -eq 1 ]
  run grep "glued.host" "${OUT}"
  [ "${status}" -eq 1 ]
}

@test "double slashes in paths are collapsed" {
  sanitize < "${INPUT}" > "${OUT}"
  run grep "^udp://doubleslash.host:1337/announce$" "${OUT}"
  [ "${status}" -eq 0 ]
  run grep "//announce" "${OUT}"
  [ "${status}" -eq 1 ]
}

@test "surrounding quotes are stripped" {
  sanitize < "${INPUT}" > "${OUT}"
  run grep "^http://quoted.host:80/announce$" "${OUT}"
  [ "${status}" -eq 0 ]
}

@test "trailing slashes are stripped" {
  sanitize < "${INPUT}" > "${OUT}"
  run grep "^http://trailing.host:80/announce$" "${OUT}"
  [ "${status}" -eq 0 ]
}

@test "announce+ garbage entries are dropped" {
  sanitize < "${INPUT}" > "${OUT}"
  run grep "plusgarbage" "${OUT}"
  [ "${status}" -eq 1 ]
}

# ---------------------------------------------------------------------------
# Blacklist exclusion filtering
# ---------------------------------------------------------------------------

@test "blacklisted trackers are excluded from the final list" {
  sanitize < "${INPUT}" > "${TEST_DIR}/clean.txt"
  bl_filter "${BLACKLIST}" "${TEST_DIR}/clean.txt" > "${OUT}"
  run grep "evil.tracker-host.com" "${OUT}"
  [ "${status}" -eq 1 ]
  # And good trackers must survive the filter
  run grep "tracker.opentrackr.org" "${OUT}"
  [ "${status}" -eq 0 ]
}

@test "blacklist matches by host:port even with different path" {
  echo "http://evil.tracker-host.com:1337/other-path" > "${TEST_DIR}/bl2.txt"
  echo "udp://evil.tracker-host.com:1337/announce" > "${TEST_DIR}/in2.txt"
  bl_filter "${TEST_DIR}/bl2.txt" "${TEST_DIR}/in2.txt" > "${OUT}"
  [ ! -s "${OUT}" ]
}

@test "empty blacklist removes nothing" {
  : > "${TEST_DIR}/empty_blacklist.txt"
  sanitize < "${INPUT}" > "${TEST_DIR}/clean.txt"
  bl_filter "${TEST_DIR}/empty_blacklist.txt" "${TEST_DIR}/clean.txt" > "${OUT}"
  in_count=$(wc -l < "${TEST_DIR}/clean.txt")
  out_count=$(wc -l < "${OUT}")
  [ "${in_count}" -eq "${out_count}" ]
}

# ---------------------------------------------------------------------------
# Pipeline integrity
# ---------------------------------------------------------------------------

@test "main workflow exists and declares both source arrays" {
  [ -f "${WORKFLOW}" ]
  grep -q 'SOURCES=(' "${WORKFLOW}"
  grep -q 'BLACKLIST_SOURCES=(' "${WORKFLOW}"
}

@test "workflow source lists contain no duplicate URLs" {
  dups=$(grep -oE '"(udp|https?|wss?)://[^"]+"' "${WORKFLOW}" | sort | uniq -d)
  [ -z "${dups}" ]
}
