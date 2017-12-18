#!/usr/bin/env bash

# Build the site and package it in a docker image.
# Tag the image with the branch, date, and commit short sha.


set -o errexit -o nounset -o pipefail

# requires inputs
GIT_BRANCH="${GIT_BRANCH}"

# run from repo root
project_dir="$(cd "$(dirname "${BASH_SOURCE}")/../.." && pwd -P)"
cd "${project_dir}"

# uncomment for testing, to make the build faster
#echo "Reducing Site Content..."
#make reduce-pages

echo "Building PDF docker image..."
make docker-pdf-build

echo "Image Build Success!"

DOCKER_IMAGE="mesosphere/dcos-docs-pdf:latest"
echo "Image: ${DOCKER_IMAGE}"
echo "${DOCKER_IMAGE}" > ".pdf-image"
