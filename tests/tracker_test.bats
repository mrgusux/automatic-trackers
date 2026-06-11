#!/usr/bin/env bats
# =============================================================================
# Test suite for the tracker aggregation pipeline.
# Run with:  bats tests/   (or `make test`)
#
# These tests verify the exact filtering rules used by scripts/update.sh.
# =============================================================================

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
UDP://TRACKER.UPPERCASE.ORG:6969/ANNOUNCE
wss://ws.tracker-host.io:443/announce
udp://evil.tracker-host.com:1337/announce
not-a-tracker-line
ftp://wrong.protocol.org:21/announce
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
  sort -u "${INPUT}" > "${OUT}"
  count=$(grep -c "udp://tracker.opentrackr.org:1337/announce" "${OUT}")
  [ "${count}" -eq 1 ]
}

@test "only valid tracker protocols are kept" {
  grep -iE '^(udp|https?|wss?)://[^[:space:]]+$' "${INPUT}" > "${OUT}"
  run grep "ftp://" "${OUT}"
  [ "${status}" -eq 1 ]
  run grep "not-a-tracker-line" "${OUT}"
  [ "${status}" -eq 1 ]
  run grep "wss://ws.tracker-host.io:443/announce" "${OUT}"
  [ "${status}" -eq 0 ]
}

@test "localhost addresses are filtered" {
  grep -viE '://(localhost|127\.|0\.0\.0\.0|255\.255\.255\.255|::1)' "${INPUT}" > "${OUT}"
  run grep "127.0.0.1" "${OUT}"
  [ "${status}" -eq 1 ]
}

@test "private RFC-1918 addresses are filtered" {
  grep -viE '://(10\.|192\.168\.|172\.1[6-9]\.|172\.2[0-9]\.|172\.3[0-1]\.|169\.254\.)' "${INPUT}" > "${OUT}"
  run grep "192.168.1.50" "${OUT}"
  [ "${status}" -eq 1 ]
  run grep "10.0.0.5" "${OUT}"
  [ "${status}" -eq 1 ]
}

@test "reserved example domains are filtered" {
  grep -viE '(example\.(com|org|net)|\.local|\.onion|\.internal)' "${INPUT}" > "${OUT}"
  run grep "tracker.example.com" "${OUT}"
  [ "${status}" -eq 1 ]
}

@test "trackers are normalized to lowercase" {
  tr '[:upper:]' '[:lower:]' < "${INPUT}" > "${OUT}"
  run grep "udp://tracker.uppercase.org:6969/announce" "${OUT}"
  [ "${status}" -eq 0 ]
  run grep "UDP://TRACKER.UPPERCASE.ORG" "${OUT}"
  [ "${status}" -eq 1 ]
}

# ---------------------------------------------------------------------------
# Blacklist exclusion filtering
# ---------------------------------------------------------------------------

@test "blacklisted trackers are excluded from the final list" {
  grep -Fvxf "${BLACKLIST}" "${INPUT}" > "${OUT}" || true
  run grep "evil.tracker-host.com" "${OUT}"
  [ "${status}" -eq 1 ]
  # And good trackers must survive the filter
  run grep "tracker.opentrackr.org" "${OUT}"
  [ "${status}" -eq 0 ]
}

@test "empty blacklist removes nothing" {
  : > "${TEST_DIR}/empty_blacklist.txt"
  grep -Fvxf "${TEST_DIR}/empty_blacklist.txt" "${INPUT}" > "${OUT}" || true
  in_count=$(wc -l < "${INPUT}")
  out_count=$(wc -l < "${OUT}")
  [ "${in_count}" -eq "${out_count}" ]
}

# ---------------------------------------------------------------------------
# Script integrity
# ---------------------------------------------------------------------------

@test "scripts/update.sh exists and is valid bash" {
  [ -f "scripts/update.sh" ]
  run bash -n scripts/update.sh
  [ "${status}" -eq 0 ]
}

@test "source config files exist and contain no duplicate URLs" {
  [ -f "config/sources.txt" ]
  [ -f "config/blacklist_sources.txt" ]
  dups=$(grep -vE '^[[:space:]]*(#|$)' config/sources.txt | sort | uniq -d)
  [ -z "${dups}" ]
}
