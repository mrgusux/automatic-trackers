# =============================================================================
# Ultimate Torrent Tracker Aggregator
# One-shot batch container: fetches, filters, and writes tracker lists,
# then exits. Outputs land in $OUTPUT_DIR (mount it as a volume).
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
# findutils provides GNU xargs (-d / -P), required for parallel fetching.
RUN apk add --no-cache \
    bash \
    ca-certificates \
    coreutils \
    curl \
    findutils \
    gawk \
    grep \
    jq \
    sed

WORKDIR /app

# Non-root user: never run network-facing batch jobs as root
RUN addgroup -g 1000 tracker && \
    adduser -D -u 1000 -G tracker tracker

# Copy only what the aggregator needs (keeps the image lean;
# .dockerignore should exclude everything else)
COPY --chown=tracker:tracker scripts/ /app/scripts/
COPY --chown=tracker:tracker config/  /app/config/

USER tracker

ENV OUTPUT_DIR=/app/output \
    CACHE_DIR=/app/.cache/trackers \
    MIN_TRACKER_COUNT=150 \
    MAX_PARALLEL_JOBS=8

RUN mkdir -p "$OUTPUT_DIR" "$CACHE_DIR"

ENTRYPOINT ["/bin/bash", "/app/scripts/update.sh"]
