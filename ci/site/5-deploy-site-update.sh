#!/usr/bin/env bash

# Install the DC/OS CLI compatible with the DC/OS cluster.
# Authenticate the CLI using a service account.
# Update an existing Marathon app to use the new docker image.

set -o errexit -o nounset -o pipefail

# required inputs
IMAGE_NAME="${IMAGE_NAME}"
IMAGE_TAG="${IMAGE_TAG}"
APP_ID="${APP_ID}" # ex: /docs-site/docs2-dev
DCOS_URL="${DCOS_URL}" # ex: https://leader.mesos
DCOS_USER_NAME="${DCOS_USER_NAME}" # ex: docs-bot
DCOS_USER_PRIVATE_KEY_PATH="${DCOS_USER_PRIVATE_KEY_PATH}" # ex: docs-bot-private.pem
DCOS_CRT="${DCOS_CRT}" # ex: docs-us.crt

# run from repo root
project_dir="$(cd "$(dirname "${BASH_SOURCE}")/../.." && pwd -P)"
cd "${project_dir}"

echo "Detecting DC/OS version..."
DCOS_VERSION_JSON="$(curl --insecure --fail --location --silent --show-error ${DCOS_URL%/}/dcos-metadata/dcos-version.json)"
DCOS_VERSION="$(echo "${DCOS_VERSION_JSON}" | grep 'version' | cut -d ':' -f 2 | cut -d '"' -f 2)"
echo "DC/OS Version: ${DCOS_VERSION}"
DCOS_MAJOR_VERSION="$(echo "${DCOS_VERSION}" | sed -e "s#[^0-9]*\([0-9][0-9]*[.][0-9][0-9]*\).*#\1#")"
echo "DC/OS Major Version: ${DCOS_MAJOR_VERSION}"

PLATFORM="linux/x86-64"
EXE_NAME="dcos"
DOWNLOAD_PATH="./.dcos-cli"
mkdir -p "${DOWNLOAD_PATH}"
DCOS_CLI_URL="https://downloads.dcos.io/binaries/cli/${PLATFORM}/dcos-${DCOS_MAJOR_VERSION}/${EXE_NAME}"
echo "Download URL: ${DCOS_CLI_URL}"
echo "Download Path: ${DOWNLOAD_PATH}/${EXE_NAME}"
echo "Downloading DC/OS CLI..."
curl --fail --location --silent --show-error -o "${DOWNLOAD_PATH}/${EXE_NAME}" "${DCOS_CLI_URL}"

echo "Installing DC/OS CLI..."
INSTALL_PATH="/usr/local/bin"
echo "Install Path: ${INSTALL_PATH}/${EXE_NAME}"
mv "${DOWNLOAD_PATH}/${EXE_NAME}" "${INSTALL_PATH}/${EXE_NAME}"
chmod a+x "${INSTALL_PATH}/${EXE_NAME}"
DCOS_CLI="${INSTALL_PATH}/${EXE_NAME}"

function cleanup() {
  echo "Resetting DC/OS CLI..."
  rm -rf "${DCOS_CLI}"
  rm -rf ~/.dcos/
}
trap cleanup EXIT

echo "Resetting DC/OS CLI config..."
rm -rf ~/.dcos/

echo "Authenticating DC/OS CLI..."
chmod 600 "${DCOS_USER_PRIVATE_KEY_PATH}"
echo no | dcos cluster setup "${DCOS_URL}" \
  --username="${DCOS_USER_NAME}" \
  --private-key="${DCOS_USER_PRIVATE_KEY_PATH}" \
  --ca-certs="${DCOS_CRT}"

echo "Printing DC/OS versions..."
dcos --version

echo "Updating Marathon app definition..."
echo "App ID: ${APP_ID}"
KEY="container.docker.image"
VALUE="${IMAGE_NAME}:${IMAGE_TAG}"
dcos marathon app show "${APP_ID}" \
  | jq '. | del(.deployments, .tasks, .tasksHealthy, .tasksRunning, .tasksStaged, .tasksUnhealthy, .version, .versionInfo)' \
  | jq ".${KEY} = \"${VALUE}\"" \
  | dcos marathon app update "${APP_ID}"

echo "Marathon App Update Success!"
