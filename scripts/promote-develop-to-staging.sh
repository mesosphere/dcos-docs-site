#!/usr/bin/env bash

set -o errexit -o nounset -o pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE}")/.." && pwd -P)"
cd "${project_dir}"

echo "Fetching new code..."
git fetch origin

scripts/validate-clean-workspace.sh

echo "Checking out develop branch..."
git checkout develop
echo "Rebasing staging changes to develop..."
git pull --rebase origin staging
echo "Pushing develop branch..."
git push --force

echo "Checking out staging branch..."
git checkout staging
echo "Rebasing develop changes to staging..."
git pull --rebase origin develop
echo "Pushing staging branch..."
git push

echo "Promotion Complete!"
