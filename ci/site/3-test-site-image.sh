#!/usr/bin/env bash

# Run the site image with the local Docker.
# Validate that the site comes up healthy with curl.

set -o errexit -o nounset -o pipefail

# requires inputs
IMAGE_NAME="${IMAGE_NAME}"
IMAGE_TAG="${IMAGE_TAG}"

# run from repo root
project_dir="$(cd "$(dirname "${BASH_SOURCE}")/../.." && pwd -P)"
cd "${project_dir}"

# optional inputs
CONTAINER_NAME="${CONTAINER_NAME:-dcos-docs-site}"

echo "Starting docker container..."
echo "Container Image: ${IMAGE_NAME}:${IMAGE_TAG}"
echo "Container Name: ${CONTAINER_NAME}"
docker run -d --name "${CONTAINER_NAME}" mesosphere/dcos-docs-site:latest

function cleanup() {
  echo "Stopping and removing docker container..."
  docker rm -f "${CONTAINER_NAME}"
}
trap 'cleanup' EXIT

echo "Looking up container IP..."
SITE_IP="$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' "${CONTAINER_NAME}")"

echo "Curling site..."
curl --fail --location --silent --show-error --verbose -o /dev/null "http://${SITE_IP}:80/"

echo "Image Test Success!"
