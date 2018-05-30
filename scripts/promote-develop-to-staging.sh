#!/usr/bin/env bash

set -o errexit -o nounset -o pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE}")/.." && pwd -P)"
cd "${project_dir}"

echo "Fetching new code..."
git fetch origin

scripts/validate-clean-workspace.sh

echo "Pulling develop branch..."
git checkout develop
git pull

echo "Pulling staging branch..."
git checkout staging
git pull

echo "Merging develop changes to staging branch..."
git merge develop --no-edit # use auto-generated merge commit message

echo "Pushing staging branch..."
git push

echo "Checking out develop branch..."
git checkout develop

echo "Rebasing staging changes to develop..."
git pull --rebase origin staging

echo "Pushing develop branch..."
git push --force # force required in case staging had new content commits (expected)

echo "Promotion Complete!"
 