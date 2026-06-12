# =============================================================================
# Ultimate Torrent Tracker Aggregator
# One-shot batch container: fetches, filters, and writes tracker lists,
# then exits. Outputs land in $OUTPUT_DIR (mount it as a volume), e.g.:
#   docker run --rm -v "$PWD/output:/app/output" automatic-trackers
#
# NOTE: This image runs scripts/update_trackers.sh - the standalone engine
# script (planned extraction of the workflow pipeline; see CHANGELOG.md
# "Unreleased"). Build this image after that script lands.
# =============================================================================

FROM alpine:3.21

# OCI standard labels (machine-readable image metadata)
LABEL org.opencontainers.image.title="automatic-trackers" \
      org.opencontainers.image.description="Ultimate Torrent Tracker Aggregator - one-shot tracker list builder" \
      org.opencontainers.image.authors="Mohammad Munna <@mrgusux>" \
      org.opencontainers.image.source="https://github.com/mrgusux/automatic-trackers" \
      org.opencontainers.image.licenses="MIT"

# Pin reproducibility at the base-image level (alpine:3.21), not per-package:
# exact apk version pins break as Alpine prunes old packages from its repos.
# findutils provides GNU xargs (-P), required for parallel fetching.
# tini = proper PID-1 signal handling (clean Ctrl+C / docker stop).
RUN apk add --no-cache \
    bash \
    ca-certificates \
    coreutils \
    curl \
    findutils \
    gawk \
    grep \
    jq \
    sed \
    tini

WORKDIR /app

# Non-root user: never run network-facing batch jobs as root
RUN addgroup -g 1000 tracker && \
    adduser -D -u 1000 -G tracker tracker

ENV OUTPUT_DIR=/app/output \
    CACHE_DIR=/app/.cache/trackers \
    MIN_TRACKER_COUNT=150 \
    MAX_PARALLEL_JOBS=8

# Create writable dirs BEFORE dropping privileges, and hand /app to the
# tracker user (WORKDIR is created root-owned by default).
RUN mkdir -p "$OUTPUT_DIR" "$CACHE_DIR" && \
    chown -R tracker:tracker /app

# Copy only what the aggregator needs (keeps the image lean;
# .dockerignore should exclude everything else)
COPY --chown=tracker:tracker scripts/ /app/scripts/

# Re-enable when source lists move out of the script into config files:
# COPY --chown=tracker:tracker sources.txt blacklist.txt /app/

USER tracker

ENTRYPOINT ["/sbin/tini", "--", "/bin/bash", "/app/scripts/update_trackers.sh"]
