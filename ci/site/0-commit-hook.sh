#!/usr/bin/env bash

set -o errexit -o nounset -o pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE}")/../.." && pwd -P)"
cd "${project_dir}"

# required inputs (fail early w/ nounset)
GIT_BRANCH="${GIT_BRANCH}"
DOCKER_USER="${DOCKER_USER}"
DOCKER_PASS="${DOCKER_PASS}"
APP_ID="${APP_ID}" # ex: /docs-site/docs2-dev
DCOS_URL="${DCOS_URL}" # ex: https://leader.mesos
DCOS_USER_NAME="${DCOS_USER_NAME}" # ex: docs-bot
DCOS_USER_PRIVATE_KEY_PATH="${DCOS_USER_PRIVATE_KEY_PATH}" # ex: docs-bot-private.pem
DCOS_CRT="${DCOS_CRT}" # ex: docs-us.crt

# optional inputs
# CONTAINER_NAME # default: dcos-docs-site

ci/site/1-setup-env.sh

ci/site/2-build-site-image.sh

DOCKER_IMAGE="$(cat ".site-image")"
IMAGE_NAME="$(echo "${DOCKER_IMAGE}" | sed 's/^\(.*\):\([^:]*\)/\1/')"
export IMAGE_NAME # export separately so errexit works :(
IMAGE_TAG="$(echo "${DOCKER_IMAGE}" | sed 's/^\(.*\):\([^:]*\)/\2/')"
export IMAGE_TAG # export separately so errexit works :(

ci/site/3-test-site-image.sh

ci/site/4-publish-site-image.sh

ci/site/5-deploy-site-update.sh
