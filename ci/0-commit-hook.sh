#!/usr/bin/env bash

set -o errexit -o nounset -o pipefail

project_dir=$(cd "$(dirname "${BASH_SOURCE}")/.." && pwd -P)
cd "${project_dir}"

# required inputs (fail early w/ nounset)
DOCKER_USER="${DOCKER_USER}"
DOCKER_PASS="${DOCKER_PASS}"
APP_ID="${APP_ID}" # ex: /docs-site/docs2-dev
DCOS_URL="${DCOS_URL}" # ex: https://leader.mesos
DCOS_USER_NAME="${DCOS_USER_NAME}" # ex: docs-bot
DCOS_USER_PRIVATE_KEY_PATH="${DCOS_USER_PRIVATE_KEY_PATH}" # ex: docs-bot-private.pem
DCOS_CRT="${DCOS_CRT}" # ex: docs-us.crt

# optional inputs
# CONTAINER_NAME # default: dcos-docs-site

ci/1-setup-env.sh

# capture output AND print to stdout
exec 5>&1
function close_file_descriptor() {
  exec 5>&-
}
trap 'close_file_descriptor' EXIT

IMAGE=$(ci/2-build-site-image.sh | tee >(cat - >&5) | grep "^Image: " | sed "s/^Image: //")
export IMAGE_NAME="$(echo "${IMAGE}" | sed 's/^\(.*\):\([^:]*\)/\1/')"
export IMAGE_TAG="$(echo "${IMAGE}" | sed 's/^\(.*\):\([^:]*\)/\2/')"

ci/3-test-site-image.sh

ci/4-publish-site-image.sh

ci/5-deploy-site-update.sh
