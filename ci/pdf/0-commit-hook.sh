#!/usr/bin/env bash

set -o errexit -o nounset -o pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE}")/../.." && pwd -P)"
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

ci/pdf/2-build-pdf-image.sh
DOCKER_IMAGE="$(cat ".pdf-image")"
export DOCKER_IMAGE # export separately so errexit works :(

ci/pdf/3-extract-pdf-bundle.sh
PDF_BUNDLE_PATH="$(cat ".pdf-bundle-path")"
export PDF_BUNDLE_PATH # export separately so errexit works :(

ci/pdf/4-publish-pdf-bundle.sh
PDF_BUNDLE_URL="$(cat ".pdf-bundle-url")"
export PDF_BUNDLE_URL # export separately so errexit works :(

ci/pdf/5-deploy-site-update.sh
