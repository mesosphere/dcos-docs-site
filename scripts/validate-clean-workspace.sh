#!/usr/bin/env bash

set -o errexit -o nounset -o pipefail

if [[ "$#" > 1 ]]; then
  echo "Invalid number of arguments. Required: 0 or 1 (path to validate); Found: $#"
fi

if [ -n "${1-}" ]; then
  # validate user-specified path, if passed as an argument
  WORKSPACE=$1
else
  # default to validating repo root
  WORKSPACE="$(cd "$(dirname "${BASH_SOURCE}")/.." && pwd -P)"
fi

cd "${WORKSPACE}"

if ! git diff-files --quiet ; then
  echo "Found unstaged changes - Exiting" >&2
  exit 1
fi

if ! git diff-index --quiet --cached HEAD ; then
  echo "Found staged changes - Exiting" >&2
  exit 1
fi

if ! git ls-files --exclude-standard --others ; then
  echo "Found untracked and unignored files - Exiting" >&2
  exit 1
fi

# git cherry will error if not tracking a remote branch
# ignore errors to allow detached HEAD
if [[ -n "$(git cherry -v 2>/dev/null)" ]]; then
  echo "Found unpushed commits - Exiting" >&2
  exit 1
fi
