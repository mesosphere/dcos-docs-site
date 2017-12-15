#!/usr/bin/env bash

# Re-Tag a docker image to 'latest' so it can be used by subsequent make commands

set -o errexit -o nounset -o pipefail

# requires inputs
DOCKER_IMAGE="${DOCKER_IMAGE}"

# run from repo root
project_dir="$(cd "$(dirname "${BASH_SOURCE}")/../.." && pwd -P)"
cd "${project_dir}"

# parse DOCKER_IMAGE
IMAGE_NAME="$(echo "${DOCKER_IMAGE}" | sed 's/^\(.*\):\([^:]*\)/\1/')"
IMAGE_TAG="$(echo "${DOCKER_IMAGE}" | sed 's/^\(.*\):\([^:]*\)/\2/')"

echo "Pulling Image: ${IMAGE_NAME}:${IMAGE_TAG}"
docker pull ${IMAGE_NAME}:${IMAGE_TAG}

# if 'latest' was specified, skip retagging.
if [[ "${IMAGE_TAG}" != "latest" ]]; then
  echo "Retagging Image: ${IMAGE_NAME}:${IMAGE_TAG} => latest"

  # remove duplicate image tag
  if [[ -n "$(docker image ls -q ${IMAGE_NAME}:latest)" ]]; then
    docker rmi ${IMAGE_NAME}:latest
  fi

  docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${IMAGE_NAME}:latest

  echo "Image Tag Success!"
fi
