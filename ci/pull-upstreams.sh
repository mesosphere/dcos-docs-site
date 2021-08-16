#!/bin/bash

# Requires git >= 2.19 for sparse checkout
# Requires rsync

set -euxo pipefail
IFS=$'\n\t'

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")"/../ > /dev/null 2>&1 && pwd)"
# Directory where the other repositories are cloned into
SYNC_DIR="$PROJECT_ROOT/sync"
mkdir -p "$SYNC_DIR"

# Manipulates global BRANCH_NAME
function construct_branch_name() {
  local ARGC="$#"

  while [ "$ARGC" -ge 4 ]; do
    if [ "$ARGC" -eq 4 ]; then
      BRANCH_NAME="$BRANCH_NAME$1/$3"
    else
      BRANCH_NAME="$BRANCH_NAME$1/$3-"
    fi
    shift 4
    ARGC="$#"
  done
}

# Manipulates global PR_NAME
function construct_pr_name() {
  local ARGC="$#"

  while [ "$ARGC" -ge 4 ]; do
    PR_NAME="$PR_NAME $1:$3"
    shift 4
    ARGC="$#"
  done
}

# Does everything which is needed for a single repository
function run() {
  local REPO_NAME="$1"      # e.g. mesosphere/konvoy
  local REPO_SUBFOLDER="$2" # e.g. docs/site
  local REPO_BRANCH="$3"    # e.g. release-1.7
  local DOCS_SUBFOLDER="$4" # e.g. pages/dkp/konvoy/1.7
  local REPO_URL="git@github.com:$REPO_NAME.git"

  function clone() {
    if [ ! -d "$SYNC_DIR/$REPO_NAME" ]; then
      git clone "$REPO_URL" "$SYNC_DIR/$REPO_NAME"
    fi
  }

  function checkout() {
    cd "$SYNC_DIR/$REPO_NAME"
    git fetch
    git checkout "$REPO_BRANCH"
    cd "$PROJECT_ROOT"
  }

  function sync_changes() {
    rsync -a --delete "$SYNC_DIR/$REPO_NAME/$REPO_SUBFOLDER/" "$PROJECT_ROOT/$DOCS_SUBFOLDER/"
  }

  function add() {
    if [ -n "$(git status --porcelain)" ]; then
      git add --all
      git commit -m "docs: sync with $REPO_NAME:$REPO_BRANCH"
    fi

  }

  clone "$REPO_NAME"
  checkout "$REPO_NAME" "$REPO_BRANCH"
  sync_changes "$REPO_NAME" "$REPO_SUBFOLDER" "$DOCS_SUBFOLDER"
  add "$REPO_NAME" "$BRANCH_NAME"
}

# Will be manipulated by construct_branch_name and construct_pr_name
PR_NAME="Sync"
BRANCH_NAME="autosync/"

# Renamed for better readability
ARGC="$#"

construct_branch_name "$@"
construct_pr_name "$@"

git checkout -t origin/main || git checkout main || echo "on main"
git checkout -t "origin/$BRANCH_NAME" || git checkout -b "$BRANCH_NAME"

while [ "$ARGC" -ge 4 ]; do
  run "$1" "$2" "$3" "$4"
  echo RUN

  shift 4
  ARGC="$#"
done

# Push changes and create PR
if [ -n "$(git diff main)" ]; then
  git push origin "$BRANCH_NAME" -uf

  curl \
    -X POST \
    -H "Accept: application/vnd.github.v3+json" \
    https://$GITHUB_TOKEN@api.github.com/repos/mesosphere/dcos-docs-site/pulls \
    -d '{"head":"'$BRANCH_NAME'","base":"main", "title": "'$PR_NAME'"}'
fi
