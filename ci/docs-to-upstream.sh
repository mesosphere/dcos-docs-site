#!/bin/bash

# Requires git >= 2.19 for sparse checkout
# Requires gh >= 1.6.2 for pr creation
# Requires rsync

set -ex
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../" && pwd)"
REPO_NAME="$1"
REPO_URL="git@github.com:$REPO_NAME.git"
REPO_SUBFOLDER="$2"
REPO_BRANCH="$3"

DOCS_SUBFOLDER="$4"

BASE_REPO_REF="$(git rev-parse --short HEAD)"

TMP_DIR="$(cd "$PROJECT_ROOT/$(mktemp -d sync.XXXXX)" && pwd)"

echo "Cloning $REPO_URL on branch $REPO_BRANCH"
cd "$TMP_DIR"
gh repo clone "$REPO_NAME" upstream -- -b "$REPO_BRANCH"

echo "Diffing repo $REPO_SUBFOLDER against docs $DOCS_SUBFOLDER"
rsync -a "$PROJECT_ROOT/$DOCS_SUBFOLDER" "$TMP_DIR/upstream/$REPO_SUBFOLDER"
cd "$TMP_DIR/upstream/$REPO_SUBFOLDER"

STATUS=$(git status)
if [ -z "$(git status --porcelain)" ]; then 
    echo "No changes found: $STATUS"
else
    echo "Changes found $STATUS"
    BRANCH="docs-sync-$REPO_BRANCH-$BASE_REPO_REF"

    echo "Creating PR against docs with branch $BRANCH"
    git add --all
    git checkout -b "$BRANCH"
    git commit -m  "docs: sync with docs repo"
    git push origin "$BRANCH" -u

    printf '\n' | gh pr create --title "Docs: Sync $REPO_BRANCH with docs repo" --body "This is an automated PR, no humans were harmed creating this PR. You can find the script in the docs repo." --base "$REPO_BRANCH" --repo="$REPO_NAME"
fi

rm -rf "$TMP_DIR"


