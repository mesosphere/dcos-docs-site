#!/usr/bin/env bash

# Log into DockerHub, publish a docker image, and log out.

set -o errexit -o nounset -o pipefail

# required inputs
IMAGE_NAME="${IMAGE_NAME}"
IMAGE_TAG="${IMAGE_TAG}"
DOCKER_USER="${DOCKER_USER}"
DOCKER_PASS="${DOCKER_PASS}"

# run from repo root
project_dir="$(cd "$(dirname "${BASH_SOURCE}")/../.." && pwd -P)"
cd "${project_dir}"

echo "Container Image: ${IMAGE_NAME}:${IMAGE_TAG}"

echo "Logging in to DockerHub..."
docker login --username "${DOCKER_USER}" --password "${DOCKER_PASS}"

function cleanup() {
  echo "Logging out off DockerHub..."
  docker logout
}
trap cleanup EXIT

echo "Publishing image to DockerHub..."
docker push "${IMAGE_NAME}:${IMAGE_TAG}"

echo "Image Publish Success!"
echo "Image: ${IMAGE_NAME}:${IMAGE_TAG}"
