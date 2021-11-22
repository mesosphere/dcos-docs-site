#!/bin/bash

# Requires git >= 2.19 for sparse checkout
# Requires rsync

set -euxo pipefail
IFS=$'\n\t'
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")"/../ >/dev/null 2>&1 && pwd)"

REPO_NAME="$1"                           # e.g. mesosphere/konvoy
REPO_SUBFOLDER="$2"                      # e.g. docs/site
REPO_BRANCH="$3"                         # e.g. release-1.7
DOCS_SUBFOLDER="$4"                      # e.g. pages/dkp/konvoy/1.7
BASE_BRANCH="$5"                         # e.g. develop or production
echo "BASE_BRANCH: " "$BASE_BRANCH"
REPO_URL="git@github.com:$REPO_NAME.git"
BRANCH="autosync/$REPO_NAME/$REPO_BRANCH"

git checkout -t origin/"$BASE_BRANCH" || git checkout "$BASE_BRANCH" || echo "on $BASE_BRANCH"
git checkout -t "origin/$BRANCH" || git checkout -b "$BRANCH"

echo "Cloning $REPO_URL on branch $REPO_BRANCH"

TMP_DIR="$PROJECT_ROOT/sync"
mkdir -p "$TMP_DIR"
cd "$PROJECT_ROOT/sync"

[ ! -d "$REPO_NAME" ] && git clone "$REPO_URL" "$REPO_NAME"

cd "$PROJECT_ROOT/sync/$REPO_NAME"
# this helps if you don't remove the repo locally.
git fetch
git checkout "$REPO_BRANCH"

echo "Diffing repo $REPO_SUBFOLDER against docs $DOCS_SUBFOLDER"
rsync -a --delete "$TMP_DIR/$REPO_NAME/$REPO_SUBFOLDER/" "$PROJECT_ROOT/$DOCS_SUBFOLDER/"
cd "$PROJECT_ROOT/$DOCS_SUBFOLDER/"

if [ -z "$(git status --porcelain)" ]; then
    echo "No changes."
else
    echo "Creating PR against docs with branch $BRANCH"
    git add --all
    git commit -m  "docs: sync with $REPO_NAME:$REPO_BRANCH"
    git push origin "$BRANCH" -uf

    curl \
      -X POST \
      -H "Accept: application/vnd.github.v3+json" \
      https://"$GITHUB_TOKEN"@api.github.com/repos/mesosphere/dcos-docs-site/pulls \
      -d '{"head":"'"$BRANCH"'","base":"'"$BASE_BRANCH"'", "title": "Sync '"$REPO_NAME:$REPO_BRANCH"'"}'
fi
