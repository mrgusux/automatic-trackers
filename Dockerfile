FROM alpine:3.19

LABEL maintainer="Mohammad Munna <@mrgusux>"
LABEL description="God-Tier Tracker Aggregator Environment"

# Install dependencies with specific versions
RUN apk add --no-cache \
    bash=5.2.21-r0 \
    curl=8.5.0-r0 \
    coreutils=9.4-r2 \
    grep=3.11-r0 \
    sed=4.9-r2 \
    gawk=5.1.0-r0 \
    zip=3.0-r12 \
    git=2.43.0-r0 \
    jq=1.7.1-r0

WORKDIR /app

# Create non-root user FIRST
RUN addgroup -g 1000 tracker && \
    adduser -D -u 1000 -G tracker tracker

# Copy files and set permissions atomically
COPY --chown=tracker:tracker . /app/

USER tracker

# Health check - verify tracker list has minimum valid content
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD [ -f "/app/all_trackers.txt" ] && [ $(wc -l < /app/all_trackers.txt) -gt 200 ] || exit 1

# Entry point with error handling
ENTRYPOINT ["/bin/bash", "-c", "cd /app && bash workflows/update.sh 2>&1 || exit $?"]
