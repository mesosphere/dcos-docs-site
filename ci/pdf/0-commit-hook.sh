#!/usr/bin/env bash

set -o errexit -o nounset -o pipefail

project_dir=$(cd "$(dirname "${BASH_SOURCE}")/../.." && pwd -P)
cd "${project_dir}"

# required inputs (fail early w/ nounset)
GIT_BRANCH="${GIT_BRANCH}"
AWS_ACCESS_KEY_ID="${AWS_ACCESS_KEY_ID}"
AWS_SECRET_ACCESS_KEY="${AWS_SECRET_ACCESS_KEY}"
AWS_DEFAULT_REGION="${AWS_DEFAULT_REGION}"
APP_ID="${APP_ID}" # ex: /docs-site/docs2-dev
DCOS_URL="${DCOS_URL}" # ex: https://leader.mesos
DCOS_USER_NAME="${DCOS_USER_NAME}" # ex: docs-bot
DCOS_USER_PRIVATE_KEY_PATH="${DCOS_USER_PRIVATE_KEY_PATH}" # ex: docs-bot-private.pem
DCOS_CRT="${DCOS_CRT}" # ex: docs-us.crt

ci/pdf/1-setup-env.sh

# capture output AND print to stdout
exec 5>&1
function close_file_descriptor() {
  exec 5>&-
}
trap 'close_file_descriptor' EXIT

export DOCKER_IMAGE="$(ci/pdf/2-build-pdf-image.sh | tee >(cat - >&5) | grep "^Image: " | sed "s/^Image: //")"

export PDF_BUNDLE_PATH="$(ci/pdf/3-extract-pdf-bundle.sh | tee >(cat - >&5) | grep "^PDF Bundle Path: " | sed "s/^PDF Bundle Path: //")"

export PDF_BUNDLE_URL="$(ci/pdf/4-publish-site-image.sh | tee >(cat - >&5) | grep "^PDF Bundle URL: " | sed "s/^PDF Bundle URL: //")"

ci/pdf/5-deploy-site-update.sh
