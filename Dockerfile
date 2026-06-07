# Base Image
FROM alpine:latest

# Metadata
LABEL maintainer="Mohammad Munna <@mrgusux>"
LABEL description="God-Tier Tracker Aggregator Environment"

# Install necessary enterprise-grade dependencies
RUN apk add --no-cache \
    bash \
    curl \
    coreutils \
    grep \
    sed \
    gawk \
    zip \
    git

# Set Working Directory
WORKDIR /app

# Copy the repository files to the container
COPY . /app

# Default command to run when the container starts
# Note: You can later replace this to directly execute a .sh script if you extract the inline workflow script.
CMD ["/bin/bash"]
