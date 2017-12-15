#!/usr/bin/env bash

set -o errexit -o nounset -o pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE}")/.." && pwd -P)"
cd "${project_dir}"

echo "Fetching new code..."
git fetch origin

scripts/validate-clean-workspace.sh

echo "Pulling staging branch..."
git checkout staging
git pull

echo "Pulling master branch..."
git checkout master
git pull

echo "Rebasing staging changes to master branch..."
# rebasing will fail if master has any commits that aren't in staging
git pull --rebase origin staging

echo "Pushing master branch..."
git push

echo "Checking out staging branch..."
# defensively move off of the master branch
# This should help avoid accidentally pushing new commits to master instead of staging/develop
git checkout staging

echo "Promotion Complete!"
