#!/usr/bin/env bash

# Log into DockerHub, publish a docker image, and log out.

set -o errexit -o nounset -o pipefail

# required inputs
PDF_BUNDLE_PATH="${PDF_BUNDLE_PATH}"
AWS_ACCESS_KEY_ID="${AWS_ACCESS_KEY_ID}"
AWS_SECRET_ACCESS_KEY="${AWS_SECRET_ACCESS_KEY}"
AWS_DEFAULT_REGION="${AWS_DEFAULT_REGION}"

# run from repo root
project_dir="$(cd "$(dirname "${BASH_SOURCE}")/../.." && pwd -P)"
cd "${project_dir}"

echo "PDF Bundle: ${PDF_BUNDLE_PATH}"

echo "Publishing PDF Bundle to S3..."
PDF_BUNDLE_NAME="$(basename "${PDF_BUNDLE_PATH}")"
aws s3 cp "${PDF_BUNDLE_PATH}" "s3://downloads.mesosphere.io/dcos-docs-site/${PDF_BUNDLE_NAME}"

echo "PDF Bundle Publish Success!"
PDF_BUNDLE_URL="https://downloads.mesosphere.com/dcos-docs-site/${PDF_BUNDLE_NAME}"
echo "PDF Bundle URL: ${PDF_BUNDLE_URL}"
echo "${PDF_BUNDLE_URL}" > ".pdf-bundle-url"
