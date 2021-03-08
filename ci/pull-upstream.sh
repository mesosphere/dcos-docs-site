#!/bin/bash

# Requires git >= 2.19 for sparse checkout
# Requires gh >= 1.6.2 for pr creation
# Requires rsync

set -euo pipefail
IFS=$'\n\t'
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")"/../ >/dev/null 2>&1 && pwd)"

REPO_NAME="$1"                           # e.g. mesosphere/konvoy
REPO_SUBFOLDER="$2"                      # e.g. docs/site
REPO_BRANCH="$3"                         # e.g. release-1.7
DOCS_SUBFOLDER="$4"                      # e.g. pages/dkp/konvoy/1.7
REPO_URL="git@github.com:$REPO_NAME.git"

echo "Cloning $REPO_URL on branch $REPO_BRANCH"

TMP_DIR="$PROJECT_ROOT/sync"
mkdir -p "$TMP_DIR"
cd "$PROJECT_ROOT/sync"
[ ! -d "$REPO_NAME" ] && git clone "https://github.com/$REPO_NAME" $REPO_NAME
cd "$PROJECT_ROOT/sync/$REPO_NAME"
git fetch
git checkout "$REPO_BRANCH"
SYNC_REPO_REF="$(git rev-parse --short HEAD)"

echo "Diffing repo $REPO_SUBFOLDER against docs $DOCS_SUBFOLDER"
rsync -a "$TMP_DIR/$REPO_NAME/$REPO_SUBFOLDER/" "$PROJECT_ROOT/$DOCS_SUBFOLDER/"
cd "$PROJECT_ROOT/$DOCS_SUBFOLDER/"

if [ -z "$(git status --porcelain)" ]; then
    echo "No changes."
else
    BRANCH="docs-sync-$REPO_BRANCH-$SYNC_REPO_REF"
    echo "Creating PR against docs with branch $BRANCH"
    git checkout -b "$BRANCH" || git checkout "$BRANCH"
    git add --all
    git commit -m  "docs: sync with $REPO_NAME:$REPO_BRANCH"

    printf '\n' | gh pr create \
      --title "Docs: Sync $REPO_NAME:$REPO_BRANCH with docs repo" \
      --body "This is an automated PR, no humans were harmed creating this PR. You can find the script in the docs repo." \
      --base main
    git checkout main
fi
