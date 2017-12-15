#!/usr/bin/env bash

set -o errexit -o nounset -o pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE}")/../.." && pwd -P)"
cd "${project_dir}"

# required inputs (fail early w/ nounset)
DOCKER_IMAGE="${DOCKER_IMAGE}"
echo "DOCKER_IMAGE=${DOCKER_IMAGE}"

ci/test/1-setup-env.sh

ci/test/2-retag-site-image.sh

ci/test/3-test-site-image.sh
