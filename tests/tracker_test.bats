#!/usr/bin/env bats

setup() {
  # Create a temporary test file
  export TEST_FILE="test_trackers.txt"
  echo "udp://tracker.example.com:80" > "$TEST_FILE"
  echo "https://tracker.valid.com:443/announce" >> "$TEST_FILE"
  echo "http://127.0.0.1:8080/announce" >> "$TEST_FILE"
  echo "udp://tracker.example.com:80" >> "$TEST_FILE" # Duplicate
}

teardown() {
  # Clean up the temporary test file
  rm -f "$TEST_FILE"
  rm -f "clean_test.txt"
}

@test "Check if duplicates are removed" {
  awk '!seen[$0]++' "$TEST_FILE" > "clean_test.txt"
  line_count=$(wc -l < "clean_test.txt")
  [ "$line_count" -eq 3 ]
}

@test "Check if localhost IPs are filtered" {
  grep -viE '://(localhost|127\.|0\.0\.0\.0)' "$TEST_FILE" > "clean_test.txt"
  run grep "127.0.0.1" "clean_test.txt"
  [ "$status" -eq 1 ] # grep should fail to find the local IP
}

@test "Check if valid protocols are preserved" {
  grep -iE '^(udp|https?|wss?)://[^[:space:]]+$' "$TEST_FILE" > "clean_test.txt"
  run grep "udp://tracker.example.com:80" "clean_test.txt"
  [ "$status" -eq 0 ] # grep should successfully find the UDP tracker
}
