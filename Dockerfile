FROM alpine:latest

LABEL maintainer="Mohammad Munna <@mrgusux>"
LABEL description="God-Tier Tracker Aggregator Environment"

RUN apk add --no-cache \
    bash \
    curl \
    coreutils \
    grep \
    sed \
    gawk \
    zip \
    git \
    jq  # ← JSON processing এর জন্য প্রয়োজন

WORKDIR /app

# Non-root user তৈরি করুন
RUN addgroup -g 1000 tracker && \
    adduser -D -u 1000 -G tracker tracker

COPY . /app
RUN chown -R tracker:tracker /app

USER tracker

# Health check যোগ করুন
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD [ -f "/app/all_trackers.txt" ] && [ $(wc -l < /app/all_trackers.txt) -gt 200 ] || exit 1

# Actual entry point
ENTRYPOINT ["/bin/bash", "-c", "cd /app && bash workflows/update.sh 2>&1"]
