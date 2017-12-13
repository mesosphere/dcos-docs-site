#!/usr/bin/env bash

# Build the site and package it in a docker image.
# Tag the image with the branch, date, and commit short sha.


set -o errexit -o nounset -o pipefail

# requires inputs
GIT_BRANCH="${GIT_BRANCH}"

# run from repo root
project_dir="$(cd "$(dirname "${BASH_SOURCE}")/../.." && pwd -P)"
cd "${project_dir}"

echo "Building site and docker image..."
make docker-site-build

echo "Image Build Success!"

IMAGE_NAME="mesosphere/dcos-docs-site"
TEMP_IMAGE_TAG="latest"

echo "Tagging docker image..."
GIT_SHA="$(git rev-parse --short HEAD)"
DATE="$(date '+%Y-%m-%d')"
IMAGE_TAG="${GIT_BRANCH}-${DATE}-${GIT_SHA}"

# remove duplicate image if build already happened
if [[ -n "$(docker image ls -q ${IMAGE_NAME}:${IMAGE_TAG})" ]]; then
  docker rmi ${IMAGE_NAME}:${IMAGE_TAG}
fi

docker tag ${IMAGE_NAME}:${TEMP_IMAGE_TAG} ${IMAGE_NAME}:${IMAGE_TAG}

echo "Image Tag Success!"
echo "Image: ${IMAGE_NAME}:${IMAGE_TAG}"
echo "${IMAGE_NAME}:${IMAGE_TAG}" > ".site-image"
