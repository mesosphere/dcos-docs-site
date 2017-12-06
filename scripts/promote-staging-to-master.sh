#!/usr/bin/env bash

set -o errexit -o nounset -o pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE}")/.." && pwd -P)"
cd "${project_dir}"

echo "Fetching new code..."
git fetch origin

scripts/validate-clean-workspace.sh

echo "Checking out master branch..."
git checkout master
echo "Rebasing staging changes to master..."
git pull --rebase origin staging
echo "Pushing master branch..."
git push

echo "Promotion Complete!"
