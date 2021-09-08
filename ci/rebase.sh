#!/bin/bash

# Requires git >= 2.19 for sparse checkout

set -euxo pipefail
IFS=$'\n\t'

BASE_BRANCH="$1"
TARGET_BRANCH="$2"

git checkout -t origin/"$BASE_BRANCH" || git checkout "$BASE_BRANCH" || echo "on $BASE_BRANCH"

git rebase origin/"$TARGET_BRANCH"
git push origin "$BASE_BRANCH" --force-with-lease
