#!/usr/bin/env bash

# Run the site image with the local Docker.
# Validate that the site comes up healthy with curl.

set -o errexit -o nounset -o pipefail

# requires inputs
DOCKER_IMAGE="${DOCKER_IMAGE}"
GIT_BRANCH="${GIT_BRANCH}"

# run from repo root
project_dir="$(cd "$(dirname "${BASH_SOURCE}")/../.." && pwd -P)"
cd "${project_dir}"

echo "Extracting PDF Bundle..."

PDF_BUNDLE_DIR="build-pdf"
PDF_BUNDLE_NAME="build-pdf.tgz"

docker run --rm \
  -v "${PWD}/${PDF_BUNDLE_DIR}:/tmp/${PDF_BUNDLE_DIR}" \
  ${DOCKER_IMAGE} \
  bash -c "cd /src && tar -cvzf /tmp/${PDF_BUNDLE_DIR}/${PDF_BUNDLE_NAME} ${PDF_BUNDLE_DIR}"

echo "Tagging PDF Bundle..."
GIT_SHA="$(git rev-parse --short HEAD)"
DATE="$(date '+%Y-%m-%d')"
NEW_PDF_BUNDLE_NAME="dcos-docs-pdf-bundle-${GIT_BRANCH}-${DATE}-${GIT_SHA}.tgz"
mv "${PDF_BUNDLE_DIR}/${PDF_BUNDLE_NAME}" "${PDF_BUNDLE_DIR}/${NEW_PDF_BUNDLE_NAME}"

echo "PDF Bundle Tag Success!"
echo "PDF Bundle Path: ${PDF_BUNDLE_DIR}/${NEW_PDF_BUNDLE_NAME}"
echo "${PDF_BUNDLE_DIR}/${NEW_PDF_BUNDLE_NAME}" > ".pdf-bundle-path"
