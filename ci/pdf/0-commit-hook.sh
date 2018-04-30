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

# Get a log of all the md files modified or new in the new push
# Source it so the variable it's currently available at any time
LATEST_MDFILES=$(git diff "${GIT_PREVIOUS_SUCCESSFUL_COMMIT}"..HEAD --name-only | grep \.md)
export LATEST_MDFILES

echo " Logging all envs"
printenv
# Settings values to upload the right directories
#FULLDATE_LAST_SUCCESSFUL_COMMIT=$(git show -s "${GIT_PREVIOUS_SUCCESSFUL_COMMIT}" --format=%ci)
FULLDATE_LAST_SUCCESSFUL_COMMIT=${BUILD_ID}
DATE_LAST_SUCCESSFUL_COMMIT="$(echo "${FULLDATE_LAST_SUCCESSFUL_COMMIT}" | cut -c1-10)"
GIT_HASH="$(git rev-parse "${GIT_PREVIOUS_SUCCESSFUL_COMMIT}")"
GIT_HASH_TRIM="$(echo "$GIT_HASH" | cut -c1-8)"
export GIT_HASH_TRIM
export DATE_LAST_SUCCESSFUL_COMMIT

# Setting the date of the last succesfull build
# JOB_NAME=""
# LAST_S_BUILD="https://jenkins-docs.mesosphere.com/job/${JOB_NAME}/api/json?tree=timestamp"

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


