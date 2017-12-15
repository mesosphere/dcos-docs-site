#!/usr/bin/env bash

# Run the site image with the local Docker.
# Validate that the site comes up healthy with curl.

set -o errexit -o nounset -o pipefail

# run from repo root
project_dir="$(cd "$(dirname "${BASH_SOURCE}")/../.." && pwd -P)"
cd "${project_dir}"

echo "Running Site..."
make docker-site-run

function cleanup() {
  echo "Stopping and removing docker container..."
  docker-compose -f ./docker/docker-compose.production.yml stop docs
  docker-compose -f ./docker/docker-compose.production.yml rm -f docs
}
trap 'cleanup' EXIT

echo "Checking Links..."
make docker-site-check-links

echo "Link Checking Success!"
